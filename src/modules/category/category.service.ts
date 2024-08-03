import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { CategoryRepository } from './category.repository';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

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

  async get(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category)
      throw new NotFoundException(`Category with id ${id} not found.}`);

    return category;
  }

  async getAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.getCategories();
    return categories;
  }

  async update(id: number, request: UpdateCategoryDto): Promise<Category> {
    const category = await this.get(id);
    const categoryExist = await this.categoryRepository.findByName(
      request.name,
    );
    if (categoryExist && request.name != category.name) {
      throw new ConflictException(
        `Category with name ${request.name} already exist.`,
      );
    }

    const result = await this.categoryRepository.updateCategory(id, request);
    return result;
  }

  async delete(id: number): Promise<boolean> {
    await this.get(id);

    const category = await this.categoryRepository.findByIdWithRelations(id);
    if (category.products.length !== 0)
      throw new ConflictException(
        'The item cannot be deleted because it is referenced by other records.',
      );

    const result = await this.categoryRepository.deleteCategory(id);
    return true;
  }
}
