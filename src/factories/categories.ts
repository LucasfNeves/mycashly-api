import { GetAllCategoriesController } from '../application/controllers/categories'
import { PrismaCategoriesRepository } from '../application/repositories/postgres/prisma-categories-repository'
import { GetAllCategoriesUseCase } from '../application/use-cases/categories'

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
