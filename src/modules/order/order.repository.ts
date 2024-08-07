import { Injectable } from '@nestjs/common';
import { Order } from 'src/entities/order.entity';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Product } from 'src/entities/product.entity';
import { OrderType } from 'src/types/order.type';
import { SearchOptionType } from 'src/types/searchOption.type';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderRepository {
  private repository = this.dataSource.getRepository(Order);

  constructor(private dataSource: DataSource) {}

  async createOrder(
    request: Order,
    orderProducts: OrderProduct[],
    qtyProducts: OrderType[], //nanti kalau bisa diganti typenya
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    //sebenarnya tidak sepenuhnya implementasi transaction
    //hanya melakukan validasi diawal
    try {
      const order = await queryRunner.manager.save(Order, request);

      //tambahkan order ke orderProduct
      orderProducts = orderProducts.map((e) => {
        e.order = order;
        return e;
      });

      //update stock
      await queryRunner.manager.save(OrderProduct, orderProducts);
      await Promise.all(
        qtyProducts.map(async (e) => {
          await queryRunner.manager.update(Product, e.productId, {
            stock: e.qty,
          });
        }),
      );

      await queryRunner.commitTransaction();
      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      queryRunner.release();
    }
  }

  async findById(id: number): Promise<Order> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['orderProducts'],
    });

    return result;
  }

  async findAll(opt: SearchOptionType): Promise<Order[]> {
    const result = await this.repository.find({
      relations: ['orderProducts'],
      take: opt.take,
      skip: opt.skip,
    });

    return result;
  }

  async count(): Promise<number> {
    const result = await this.repository.count({});
    return result;
  }
}
