import { Category } from '@prisma/client'
import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { CategoriesRepository } from '../../repositories/interfaces/categories-repository'

export interface GetAllCategoriesResponse {
  categories: Category[]
}

export class GetAllCategoriesUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(userId: string) {
    if (!userId) {
      throw new UserNotFoundError()
    }

    const categories = await this.categoriesRepository.findyAllByUserId(userId)

    return { categories }
  }
}
