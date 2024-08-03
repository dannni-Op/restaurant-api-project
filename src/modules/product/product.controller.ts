import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from 'src/entities/product.entity';
import { UpdateProductDto } from './dto/updateProduct.dto';

//Untuk product name dan sku itu unique
//tidak mungkin ada nama yang sama
//tidak mungkin ada sku yang sama
@Controller('/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async create(@Body() request: CreateProductDto): Promise<Product> {
    const product = await this.productService.create(request);
    return product;
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    const product = await this.productService.get(id);
    return product;
  }

  @Get()
  async getAll(): Promise<Product[]> {
    const products = await this.productService.getAll();
    return products;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateProductDto,
  ): Promise<Product> {
    if (Object.keys(request).length === 0) {
      return await this.get(id);
    }
    const product = await this.productService.update(id, request);
    return product;
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const result = await this.productService.delete(id);
    return result;
  }
}
