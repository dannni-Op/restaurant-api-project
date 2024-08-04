import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { ProductController } from './product.controller';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule],
  exports: [ProductService],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
