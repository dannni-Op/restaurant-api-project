import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { Category } from 'src/entities/category.entity';
import { UpdateProductDto } from './dto/updateProduct.dto';

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

  async findAll(): Promise<Product[]> {
    const result = await this.repository.find({
      relations: ['category'],
    });
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
