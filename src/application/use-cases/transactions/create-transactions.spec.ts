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

  it('should not create a transaction if category does not exist', async () => {
    // arrange

    const userId = '1'
    const categoryId = 'invalid_category_id'

    await registerUseCase.execute(createUserParams)

    //act
    const transaction = sut.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    //assert
    expect(transaction).rejects.toBeInstanceOf(NotFoundException)
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
})
