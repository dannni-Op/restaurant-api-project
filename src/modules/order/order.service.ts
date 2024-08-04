import { HttpException, Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Order } from 'src/entities/order.entity';
import { ProductService } from '../product/product.service';
import { v4 as uuid } from 'uuid';
import { PaymentService } from '../payment/payment.service';
import { UserService } from '../user/user.service';
import { OrderProductService } from '../orderProduct/orderProduct.service';
import { OrderProduct } from 'src/entities/orderProduct.entity';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private paymentService: PaymentService,
    private productService: ProductService,
    private userService: UserService,
    private orderProductService: OrderProductService,
  ) {}

  async create(userId: number, request: CreateOrderDto): Promise<Order> {
    const payment = await this.paymentService.get(request.paymentId);

    //saat ini saat user tidak ada akan kembalikan error
    //nanti bisa dibenahi apabila user tidak ada langsung logout
    const user = await this.userService.get(userId);

    let orderProducts: OrderProduct[] = [];

    //total price
    const { products } = request;
    let totalPrice: number = 0;
    //perlu belajar lagi untuk async callback
    await Promise.all(
      products.map(async (e) => {
        const product = await this.productService.get(e.productId);

        //saat ini apabila qty 0 maka akan tetap membuat order
        //kedepannya bisa dibuat validasi supaya minimal quantity 1
        const totalPriceCurrentProduct: number = product.price * e.qty;

        //order akan ditambahkan dibawah
        const orderProduct: OrderProduct = new OrderProduct();
        orderProduct.product = product;
        orderProduct.qty = e.qty;
        orderProduct.totalPrice = totalPriceCurrentProduct;

        orderProducts.push(orderProduct);

        //jumlahkan seluruh product price
        if (totalPriceCurrentProduct !== 0)
          totalPrice += totalPriceCurrentProduct;
      }),
    );

    //total return
    const totalReturn: number = request.totalPaid - totalPrice;
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

    const result = await this.orderRepository.createOrder(order);

    //tambahkan order ke orderProduct
    orderProducts = await Promise.all(
      orderProducts.map(async (e) => {
        e.order = result;

        //kurangi stock
        //butuh transaction sepertinya
        await this.productService.reduceStock(e.product.id, e.qty);

        return e;
      }),
    );

    //create order product
    await this.orderProductService.bulk(orderProducts);
    return await this.orderRepository.findById(result.id);
  }
}
