import { Category } from '@prisma/client'
import { NotFoundException } from '../../../errors/not-found-exception'
import { CategoriesRepository } from '../../repositories/interfaces/categories-repository'

interface ValidateCategoryOwnershipRequest {
  categoryId: string
  accountId: string
}

interface ValidateCategoryOwnershipResponse {
  category: Category | null
}

export class ValidateCategoryOwnershipUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute({
    categoryId,
    accountId,
  }: ValidateCategoryOwnershipRequest): Promise<ValidateCategoryOwnershipResponse> {
    const category = await this.categoriesRepository.findFirst(
      categoryId,
      accountId,
    )

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return { category }
  }
}
