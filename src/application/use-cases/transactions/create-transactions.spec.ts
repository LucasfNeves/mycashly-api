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

  const createTransactionParams = {
    ...transaction,
    categoryId: undefined,
    userId: undefined,
  }

  const createUserParams = {
    ...user,
  }

  let usersRepository: inMemoryUsersRepository
  let categoryRepository: inMemoryCategoriesRepository
  let transactionRepository: inMemoryTransactionsRepository
  let registerUseCase: RegisterUseCase
  let generateIdAdapter: IdGeneratorAdapterStub
  let sut: CreateTransactionUseCase

  beforeEach(async () => {
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
  })

  it('should create a transaction successfully', async () => {
    // arrange
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)

    //act
    const transaction = await sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    //
    expect(transaction).toBeTruthy()
  })

  it('should not create a transaction if user does not exist', async () => {
    // arrange

    const userId = 'invalid_user_id'
    const categoryId = '3'

    //act
    const transaction = sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    //assert
    expect(transaction).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not create transactions id invalid', async () => {
    // arrange

    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)

    vi.spyOn(generateIdAdapter, 'execute').mockRejectedValue(
      new NotFoundException('ID not found'),
    )

    //act
    const promise = sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    //assert
    await expect(promise).rejects.toBeInstanceOf(NotFoundException)
  })

  it('should not create a transaction if category does not exist', async () => {
    // arrange

    const userId = '1'
    const categoryId = 'invalid_category_id'

    await registerUseCase.execute(createUserParams)

    vi.spyOn(categoryRepository, 'findyAllByUserId').mockRejectedValue(
      new NotFoundException('Category not found'),
    )

    //act
    const promise = sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    //assert
    await expect(promise).rejects.toBeInstanceOf(NotFoundException)
  })

  it('should call GetUserByIdRepository with correct values', async () => {
    // arrange
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)

    const executeSpy = vi.spyOn(usersRepository, 'findById')

    // act
    await sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId)
  })

  it('should call IdGeneratorAdpter', async () => {
    // arrange
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)

    const executeSpy = vi.spyOn(generateIdAdapter, 'execute')

    // act
    await sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })
    // assert
    expect(executeSpy).toHaveBeenCalled()
  })

  it('should call CreateTransactionRepository with correct values', async () => {
    // arrange
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)

    const executeSpy = vi.spyOn(transactionRepository, 'create')

    // act
    await sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    // assert
    expect(executeSpy).toHaveBeenCalledWith({
      ...createTransactionParams,
      id: 'random_id',
      User: {
        connect: { id: userId },
      },
      category: {
        connect: { id: categoryId },
      },
    })
  })

  it('should throw if CreateTransactionRepository throws', async () => {
    // arrange
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)

    vi.spyOn(transactionRepository, 'create').mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    // assert
    await expect(promise).rejects.toThrow()
  })

  it('should create a transaction associated with the correct user', async () => {
    // arrange
    const userId = '1'
    const categoryId = '3'

    await registerUseCase.execute(createUserParams)

    // act
    const result = await sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    // assert
    expect(result.transaction.userId).toEqual(userId)
  })

  it('should not create a transaction if the type is invalid', async () => {
    const invalidTransactionData = {
      ...createTransactionParams,
      type: 'INVALID_TYPE',
    }

    // Validação usando o schema
    const promise = createtransactionSchema.parseAsync(invalidTransactionData)

    // assert
    await expect(promise).rejects.toThrowError(
      'Type must be INCOME, EXPENSE, or INVESTMENT.',
    )
  })

  it('should call findFirst from CategoriesRepository with correct values', async () => {
    // arrange
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

    // act
    await sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    // assert
    expect(findFirstSpy).toHaveBeenCalledWith(categoryId, userId)
  })

  it('should throw NotFoundException if category is not found', async () => {
    // arrange
    const userId = '1'
    const categoryId = 'invalid_category_id'

    await registerUseCase.execute(createUserParams)

    vi.spyOn(categoryRepository, 'findFirst').mockResolvedValue(null)

    // act
    const promise = sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    // assert
    await expect(promise).rejects.toBeInstanceOf(NotFoundException)
    await expect(promise).rejects.toThrowError('Category not found')
  })
})
