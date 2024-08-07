import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Order } from 'src/entities/order.entity';
import { ProductService } from '../product/product.service';
import { v4 as uuid } from 'uuid';
import { PaymentService } from '../payment/payment.service';
import { UserService } from '../user/user.service';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { OrderType } from 'src/types/order.type';
import { SearchOrder } from './dto/searchOrder.dto';
import { ResponsePaging } from 'src/types/responsePaging.type';
import { SearchOptionType } from 'src/types/searchOption.type';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private paymentService: PaymentService,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  async create(userId: number, request: CreateOrderDto): Promise<Order> {
    const payment = await this.paymentService.get(request.paymentId);

    //saat ini saat user tidak ada akan kembalikan error
    //nanti bisa dibenahi apabila user tidak ada langsung logout
    const user = await this.userService.get(userId);

    let orderProducts: OrderProduct[] = []; //menampung Order Product yang siap input
    let qtyProducts: OrderType[] = []; //menampung stock product yang siap input

    //total price
    const { products } = request;
    let totalPrice: number = 0;
    let totalReturn: number = 0;

    //perlu belajar lagi untuk async callback
    await Promise.all(
      products.map(async (e) => {
        const product = await this.productService.get(e.productId);

        const totalPriceCurrentProduct: number = product.price * e.qty;
        //jumlahkan seluruh product price
        if (totalPriceCurrentProduct !== 0)
          totalPrice += totalPriceCurrentProduct;

        //kurangi stock
        const result = await this.productService.remainingStockReduction(
          e.productId,
          e.qty,
        );
        if (result) {
          qtyProducts.push({
            productId: e.productId,
            qty: result,
          });
        }

        //order akan ditambahkan dibawah
        const orderProduct: OrderProduct = new OrderProduct();
        orderProduct.product = product;
        orderProduct.qty = e.qty;
        orderProduct.totalPrice = totalPriceCurrentProduct;

        orderProducts.push(orderProduct);
      }),
    );

    //total return
    totalReturn += request.totalPaid - totalPrice;
    if (totalReturn < 0)
      throw new HttpException('Insufficient payment amount.', 400);

    const order: Order = new Order();
    order.name = request.name;
    order.totalPrice = totalPrice;
    order.totalPaid = request.totalPaid;
    order.totalReturn = totalReturn;
    order.receiptCode = uuid();
    order.payment = payment;
    order.user = user;

    const result = await this.orderRepository.createOrder(
      order,
      orderProducts,
      qtyProducts,
    );

    return await this.get(result.id);
  }

  async get(id: number): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found.`);
    return order;
  }

  async getAll(search: SearchOrder): Promise<ResponsePaging<Order[]>> {
    const skip = (search.page - 1) * search.size;
    const take = search.size;

    const opt: SearchOptionType = {
      skip,
      take,
    };

    const orders = await this.orderRepository.findAll(opt);
    const countOrders = await this.orderRepository.count();

    const totalPage = Math.ceil(countOrders / search.size);

    return {
      data: orders,
      paging: {
        totalPage,
        currentPage: search.page,
        size: search.size,
      },
    };
  }
}
