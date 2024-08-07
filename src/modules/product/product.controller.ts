import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from 'src/entities/product.entity';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Roles } from 'src/decorators/role.decorator';
import { SearchProduct } from './dto/searchProduct.dto';
import { ResponsePaging } from 'src/types/responsePaging.type';

//Untuk product name dan sku itu unique
//tidak mungkin ada nama yang sama
//tidak mungkin ada sku yang sama
@Roles('admin')
@Controller('/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async create(@Body() request: CreateProductDto): Promise<Product> {
    const product = await this.productService.create(request);
    return product;
  }

  @Roles('cashier')
  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    const product = await this.productService.get(id);
    return product;
  }

  @Roles('cashier')
  @Get()
  async getAll(
    @Query('search') search: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ): Promise<ResponsePaging<Product[]>> {
    const searchRequest: SearchProduct = {
      search,
      page: page ? page : 1,
      size: size ? size : 5,
    };
    const products = await this.productService.getAll(searchRequest);
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
