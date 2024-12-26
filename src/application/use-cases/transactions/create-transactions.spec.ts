import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateTransactionUseCase } from './index'
import { RegisterUseCase } from '../user/index'
import { transaction, user } from '../../../tests/fixtures/index'
import {
  inMemoryUsersRepository,
  inMemoryCategoriesRepository,
  inMemoryTransactionsRepository,
} from '../../repositories/in-memory/index'
import { UserNotFoundError, NotFoundException } from '../../../errors/index'
import { createtransactionSchema } from '../../../schemas/transactions'

describe('Create Transaction Use Case', () => {
  class IdGeneratorAdapterStub {
    async execute(): Promise<string> {
      return 'random_id'
    }
  }

  let usersRepository: inMemoryUsersRepository
  let categoryRepository: inMemoryCategoriesRepository
  let transactionRepository: inMemoryTransactionsRepository
  let registerUseCase: RegisterUseCase
  let generateIdAdapter: IdGeneratorAdapterStub
  let sut: CreateTransactionUseCase

  const createTransactionParams = {
    ...transaction,
    categoryId: undefined,
    userId: undefined,
  }

  const createUserParams = { ...user }

  const setup = async () => {
    usersRepository = new inMemoryUsersRepository()
    categoryRepository = new inMemoryCategoriesRepository()
    transactionRepository = new inMemoryTransactionsRepository()
    generateIdAdapter = new IdGeneratorAdapterStub()
    registerUseCase = new RegisterUseCase(usersRepository)
    sut = new CreateTransactionUseCase(
      transactionRepository,
      usersRepository,
      generateIdAdapter,
      categoryRepository,
    )
  }

  beforeEach(async () => {
    await setup()
  })

  const executeTransaction = async (userId: string, categoryId: string) =>
    await sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

  it('should create a transaction successfully', async () => {
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)

    const transaction = await executeTransaction(userId, categoryId)

    expect(transaction).toBeTruthy()
  })

  it('should not create a transaction if user does not exist', async () => {
    const userId = 'invalid_user_id'
    const categoryId = '3'

    await expect(executeTransaction(userId, categoryId)).rejects.toBeInstanceOf(
      UserNotFoundError,
    )
  })

  it('should handle errors when generating transaction ID', async () => {
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)
    vi.spyOn(generateIdAdapter, 'execute').mockRejectedValue(
      new NotFoundException('ID not found'),
    )

    await expect(executeTransaction(userId, categoryId)).rejects.toBeInstanceOf(
      NotFoundException,
    )
  })

  it('should not create a transaction if category does not exist', async () => {
    const userId = '1'
    const categoryId = 'invalid_category_id'

    await registerUseCase.execute(createUserParams)
    vi.spyOn(categoryRepository, 'findyAllByUserId').mockRejectedValue(
      new NotFoundException('Category not found'),
    )

    await expect(executeTransaction(userId, categoryId)).rejects.toBeInstanceOf(
      NotFoundException,
    )
  })

  it('should call GetUserByIdRepository with correct values', async () => {
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)
    const executeSpy = vi.spyOn(usersRepository, 'findById')

    await executeTransaction(userId, categoryId)

    expect(executeSpy).toHaveBeenCalledWith(userId)
  })

  it('should call IdGeneratorAdapter with correct values', async () => {
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)
    const executeSpy = vi.spyOn(generateIdAdapter, 'execute')

    await executeTransaction(userId, categoryId)

    expect(executeSpy).toHaveBeenCalled()
  })

  it('should call CreateTransactionRepository with correct values', async () => {
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)
    const executeSpy = vi.spyOn(transactionRepository, 'create')

    await executeTransaction(userId, categoryId)

    expect(executeSpy).toHaveBeenCalledWith({
      ...createTransactionParams,
      id: 'random_id',
      User: { connect: { id: userId } },
      category: { connect: { id: categoryId } },
    })
  })

  it('should throw if CreateTransactionRepository throws', async () => {
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)
    vi.spyOn(transactionRepository, 'create').mockRejectedValueOnce(new Error())

    await expect(executeTransaction(userId, categoryId)).rejects.toThrow()
  })

  it('should create a transaction associated with the correct user', async () => {
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)

    const result = await executeTransaction(userId, categoryId)

    expect(result.transaction.userId).toEqual(userId)
  })

  it('should not create a transaction if the type is invalid', async () => {
    const invalidTransactionData = {
      ...createTransactionParams,
      type: 'INVALID_TYPE',
    }

    await expect(
      createtransactionSchema.parseAsync(invalidTransactionData),
    ).rejects.toThrowError('Type must be INCOME, EXPENSE, or INVESTMENT.')
  })

  it('should call findFirst from CategoriesRepository with correct values', async () => {
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)
    const findFirstSpy = vi
      .spyOn(categoryRepository, 'findFirst')
      .mockResolvedValue({
        id: categoryId,
        name: 'Test Category',
        userId,
        type: 'EXPENSE',
      })

    await executeTransaction(userId, categoryId)

    expect(findFirstSpy).toHaveBeenCalledWith(categoryId, userId)
  })

  it('should throw NotFoundException if category is not found', async () => {
    const userId = '1'
    const categoryId = 'invalid_category_id'

    await registerUseCase.execute(createUserParams)
    vi.spyOn(categoryRepository, 'findFirst').mockResolvedValue(null)

    await expect(executeTransaction(userId, categoryId)).rejects.toBeInstanceOf(
      NotFoundException,
    )
    await expect(executeTransaction(userId, categoryId)).rejects.toThrowError(
      'Category not found',
    )
  })
})
