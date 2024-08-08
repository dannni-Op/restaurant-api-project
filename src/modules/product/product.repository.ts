import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { Category } from 'src/entities/category.entity';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { SearchOptionType } from 'src/types/searchOption.type';

@Injectable()
export class ProductRepository {
  private repository = this.dataSource.getRepository(Product);

  constructor(private dataSource: DataSource) {}

  async createProduct(
    category: Category,
    request: CreateProductDto,
  ): Promise<Product> {
    const product = this.repository.create(request);
    product.category = category;
    const result = await this.repository.save(product);
    return result;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const result = await this.repository.findOne({
      where: { sku },
    });
    return result;
  }

  async findByName(name: string): Promise<Product | null> {
    const result = await this.repository.findOne({
      where: { name },
    });
    return result;
  }

  async findImagePath(path: string): Promise<string | null> {
    const result = await this.repository.findOne({
      where: {
        image: path,
      },
    });

    return result?.image;
  }

  async findById(id: number): Promise<Product | null> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['category'],
    });
    return result;
  }

  async findAll(keywoard: string, opt: SearchOptionType): Promise<Product[]> {
    if (keywoard) {
      const query = this.repository
        .createQueryBuilder('products')
        .innerJoinAndSelect('products.category', 'categories')
        .where('categories.name ilike :name', { name: `%${keywoard}%` })
        .orWhere('products.name ilike :name', { name: `%${keywoard}%` })
        .orderBy('products.createdAt', 'ASC')
        .skip(opt.skip)
        .take(opt.take);
      const result = await query.getMany();
      return result;
    }

    const result = await this.repository.find({
      relations: ['category'],
      take: opt.take,
      skip: opt.skip,
    });
    return result;
  }

  async countProducts(keywoard: string): Promise<number> {
    if (keywoard) {
      const result = await this.repository
        .createQueryBuilder('products')
        .innerJoinAndSelect('products.category', 'categories')
        .where('categories.name like :name', { name: `%${keywoard}%` })
        .orWhere('products.name ilike :name', { name: `%${keywoard}%` })
        .getCount();
      return result;
    }
    const result = await this.repository.count();
    return result;
  }

  async updateProduct(
    id: number,
    category: Category,
    request: UpdateProductDto,
  ): Promise<Product> {
    await this.repository.update(id, {
      ...request,
      category,
    });
    const result = await this.findById(id);
    return result;
  }

  async deleteProduct(id: number): Promise<boolean> {
    await this.repository.delete({ id });
    return true;
  }

  async updateStock(id: number, stock: number): Promise<Product> {
    await this.repository.update(id, {
      stock,
    });
    const result = await this.findById(id);
    return result;
  }

  async findByIdWithOrderRelation(id: number): Promise<Product | null> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['orderProducts'],
    });
    return result;
  }
}
