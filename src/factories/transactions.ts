import { IdGeneratorAdapter } from '../adapters/id-generator'
import {
  UpdateTransactionsController,
  CreateTransactionsController,
} from '../application/controllers/transactions/index'
import { PrismaUsersRepository } from '../application/repositories/postgres'
import { PrismaCategoriesRepository } from '../application/repositories/postgres/prisma-categories-repository'
import { PrismaTransactionsRepository } from '../application/repositories/postgres/prisma-transaction-repository'
import {
  CreateTransactionUseCase,
  UpdateTransactionUseCase,
} from '../application/use-cases/transactions/index'

export const makeCreateTransactionsController = () => {
  const transactionsRepository = new PrismaTransactionsRepository()
  const getUsersByIdRepository = new PrismaUsersRepository()
  const generateIdAdapter = new IdGeneratorAdapter()
  const categoriesRepository = new PrismaCategoriesRepository()

  const createTransactionUseCase = new CreateTransactionUseCase(
    transactionsRepository,
    getUsersByIdRepository,
    generateIdAdapter,
    categoriesRepository,
  )

  const createTransactionsController = new CreateTransactionsController(
    createTransactionUseCase,
  )

  return createTransactionsController
}

export const makeUpdateTransactionsController = () => {
  const transactionsRepository = new PrismaTransactionsRepository()
  const categoriesRepository = new PrismaCategoriesRepository()

  const updateTransactionUseCase = new UpdateTransactionUseCase(
    transactionsRepository,
    categoriesRepository,
  )

  const updateTransactionsController = new UpdateTransactionsController(
    updateTransactionUseCase,
  )

  return updateTransactionsController
}
