import { ConflictException, Injectable } from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(request: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findByName(request.name);
    if (category)
      throw new ConflictException(
        `Category with name ${request.name} already exist.`,
      );

    const result = await this.categoryRepository.createCategory(request);
    return result;
  }
}
