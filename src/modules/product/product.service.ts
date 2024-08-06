import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from 'src/entities/product.entity';
import { CategoryRepository } from '../category/category.repository';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async create(request: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findById(request.categoryId);
    if (!category)
      throw new NotFoundException(
        `Category with id ${request.categoryId} not found.`,
      );

    const productSku = await this.productRepository.findBySku(request.sku);
    const productName = await this.productRepository.findByName(request.name);

    if (productSku)
      throw new ConflictException(
        `Product with sku ${request.sku} already exist.`,
      );

    if (productName)
      throw new ConflictException(
        `Product with name ${request.name} already exist.`,
      );

    if (request.image) {
      const image = await this.productRepository.findImagePath(request.image);
      if (image)
        throw new ConflictException(
          `There are products with the same name or image path.`,
        );
    }

    const result = await this.productRepository.createProduct(
      category,
      request,
    );
    return result;
  }

  async get(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found.`);

    return product;
  }

  async getAll(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    return products;
  }

  async update(id: number, request: UpdateProductDto): Promise<Product> {
    const product = await this.get(id);
    let category = product.category;

    if (request.categoryId && request.categoryId !== category.id) {
      category = await this.categoryRepository.findById(request.categoryId);
      if (!category)
        throw new NotFoundException(
          `Category with id ${request.categoryId} not found.`,
        );
    }

    if (request.name) {
      const productName = await this.productRepository.findByName(request.name);
      if (productName && productName.id !== product.id)
        throw new ConflictException(
          `Product with name ${request.name} already exist.`,
        );
    }

    if (request.sku) {
      const productSku = await this.productRepository.findBySku(request.sku);
      if (productSku && productSku.id !== product.id)
        throw new ConflictException(
          `Product with sku ${request.sku} already exist.`,
        );
    }

    if (request.image) {
      const image = await this.productRepository.findImagePath(request.image);
      if (image && image !== product.image)
        throw new ConflictException(
          `There are products with the same name or image path.`,
        );
    }

    //mentok, tidak temukan cara yang efisien untuk hapus property categoryId saat ada
    delete request.categoryId;

    const result = await this.productRepository.updateProduct(
      id,
      category,
      request,
    );
    return result;
  }

  async delete(id: number): Promise<boolean> {
    await this.get(id);

    const product = await this.productRepository.findByIdWithOrderRelation(id);
    if (product.orderProducts.length > 0)
      throw new ConflictException(
        'The Product cannot be deleted because it is referenced by other records.',
      );

    const result = await this.productRepository.deleteProduct(id);
    return result;
  }

  async remainingStockAddition(id: number, quantity: number): Promise<number> {
    const product = await this.get(id);

    if (quantity < 0) {
      //nilai munis (tolak)
      throw new BadRequestException('Quantity must be a non-negative number.');
    }

    return product.stock + quantity;
  }

  async remainingStockReduction(id: number, quantity: number): Promise<number> {
    const product = await this.get(id);

    if (quantity < 0) {
      //nilai munis (tolak)
      throw new BadRequestException('Quantity must be a non-negative number.');
    } else if (quantity == 0) {
      throw new BadRequestException('Quantity must be more than zero.');
    }

    if (product.stock == 0) {
      //stock habis
      throw new HttpException('Product stock is depleted.', 400);
    } else if (product.stock < quantity) {
      //stock tidak cukup
      throw new HttpException('Not enough stock available.', 400);
    }

    return product.stock - quantity;
  }
}
