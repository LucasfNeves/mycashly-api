import {
  GetAllCategoriesController,
  ValidateCategoryOwnershipController,
} from '../application/controllers/categories'
import { PrismaCategoriesRepository } from '../application/repositories/postgres/prisma-categories-repository'
import {
  GetAllCategoriesUseCase,
  ValidateCategoryOwnershipUseCase,
} from '../application/use-cases/categories'

export const makeGetAllCategoriesController = () => {
  const categoriesRepository = new PrismaCategoriesRepository()

  const getAllCategoriesUseCase = new GetAllCategoriesUseCase(
    categoriesRepository,
  )

  const getAllCategoriesController = new GetAllCategoriesController(
    getAllCategoriesUseCase,
  )

  return getAllCategoriesController
}

export const makeValidateCategoryOwnershipController = () => {
  const categoriesRepository = new PrismaCategoriesRepository()

  const validateCategoryOwnershipUseCase = new ValidateCategoryOwnershipUseCase(
    categoriesRepository,
  )

  const validateCategoryOwnershipController =
    new ValidateCategoryOwnershipController(validateCategoryOwnershipUseCase)

  return validateCategoryOwnershipController
}
