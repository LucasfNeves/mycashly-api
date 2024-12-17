import { IdGeneratorAdapter } from '../adapters/id-generator'
import { CreateTransactionsController } from '../application/controllers/transactions/create-transactions'
import { PrismaUsersRepository } from '../application/repositories/postgres'
import { PrismaCategoriesRepository } from '../application/repositories/postgres/prisma-categories-repository'
import { PrismaTransactionsRepository } from '../application/repositories/postgres/prisma-transaction-repository'
import { CreateTransactionUseCase } from '../application/use-cases/transactions/create-transactions'

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
