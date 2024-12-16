import { Category } from '@prisma/client'
import { CategoriesRepository } from '../../repositories/interfaces/categories-repository'
import { NotFoundException } from '../../../errors/not-found-exception'

export interface GetAllCategoriesResponse {
  categories: Category[]
}

export class GetAllCategoriesUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(userId: string) {
    const categories = await this.categoriesRepository.findyAllByUserId(userId)

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories not found')
    }

    return { categories }
  }
}
