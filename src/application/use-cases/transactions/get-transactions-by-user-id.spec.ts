import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateTransactionUseCase } from '.'
import { JwtAdapterImpl } from '../../../adapters/jwt-adapter'
import {
  inMemoryCategoriesRepository,
  inMemoryTransactionsRepository,
  inMemoryUsersRepository,
} from '../../repositories/in-memory'
import { InMemoryRefreshTokenRepository } from '../../repositories/in-memory/in-memory-refresh-token-repository'
import { RegisterUseCase } from '../user'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id'
import { transaction, user } from '../../../tests/fixtures'
import { UserNotFoundError } from '../../../errors'

describe('GetTransactionUseCase', () => {
  const createTransactionParams = {
    ...transaction,
    categoryId: undefined,
    userId: undefined,
  }

  const createUserParams = {
    ...user,
  }

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
  let createTransactionUseCase: CreateTransactionUseCase
  let sut: GetTransactionsByUserIdUseCase

  const setupUseCases = () => {
    usersRepository = new inMemoryUsersRepository()
    categoryRepository = new inMemoryCategoriesRepository()
    transactionRepository = new inMemoryTransactionsRepository()
    generateIdAdapter = new IdGeneratorAdapterStub()
    createTransactionUseCase = new CreateTransactionUseCase(
      transactionRepository,
      usersRepository,
      generateIdAdapter,
      categoryRepository,
    )
    const refreshTokenRepository = new InMemoryRefreshTokenRepository()
    const jwtAdapter = new JwtAdapterImpl()
    registerUseCase = new RegisterUseCase(
      usersRepository,
      refreshTokenRepository,
      jwtAdapter,
    )
    sut = new GetTransactionsByUserIdUseCase(
      transactionRepository,
      usersRepository,
    )
  }

  beforeEach(async () => {
    setupUseCases()
  })

  const createAndRegisterUserTransaction = async (
    userId: string,
    categoryId: string,
  ) => {
    await registerUseCase.execute(createUserParams)

    const { transaction } = await createTransactionUseCase.execute({
      ...createTransactionParams,
      categoryId,
      userId,
    })

    return transaction
  }

  it('should get transaction sucessfully', async () => {
    // arrange
    const userId = '1'
    const categoryId = '2'
    const transaction = await createAndRegisterUserTransaction(
      userId,
      categoryId,
    )

    // act
    const response = await sut.execute(userId, {
      month: transaction.date.getDay(),
      year: transaction.date.getFullYear(),
    })

    // assert
    expect(response).toEqual([transaction])
  })

  it('should throw UserNotFound if user does not exist', async () => {
    // arrange
    const userId = 'invalid_id'

    vi.spyOn(usersRepository, 'findById').mockResolvedValue(null)

    // act
    const promise = sut.execute(userId, { month: 1, year: 2021 })

    // assert
    await expect(promise).rejects.toThrow(
      new UserNotFoundError('User not found'),
    )
  })

  it('should call GetTransactionRepository with correct values', async () => {
    // arrange
    const userId = '1'
    const categoryId = '2'
    const transaction = await createAndRegisterUserTransaction(
      userId,
      categoryId,
    )

    const executeSpy = vi.spyOn(transactionRepository, 'findByUserId')

    // act
    await sut.execute(userId, {
      month: transaction.date.getDay(),
      year: transaction.date.getFullYear(),
    })

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId, {
      month: transaction.date.getDay(),
      year: transaction.date.getFullYear(),
    })
  })

  it('should call GetUserByIdRepository with correct values', async () => {
    // arrange
    const userId = '1'
    const categoryId = '2'
    const transaction = await createAndRegisterUserTransaction(
      userId,
      categoryId,
    )

    const executeSpy = vi.spyOn(usersRepository, 'findById')

    // act
    await sut.execute(userId, {
      month: transaction.date.getDay(),
      year: transaction.date.getFullYear(),
    })

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId)
  })

  it('should throw if GetUserByIdRepository throws', async () => {
    // arrange
    const userId = '1'
    const categoryId = '2'
    const transaction = await createAndRegisterUserTransaction(
      userId,
      categoryId,
    )

    vi.spyOn(usersRepository, 'findById').mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(userId, {
      month: transaction.date.getDay(),
      year: transaction.date.getFullYear(),
    })

    // assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw if GetTransactionRepository throws', async () => {
    // arrange
    const userId = '1'
    const categoryId = '2'
    const transaction = await createAndRegisterUserTransaction(
      userId,
      categoryId,
    )

    vi.spyOn(transactionRepository, 'findByUserId').mockRejectedValueOnce(
      new Error(),
    )

    // act
    const promise = sut.execute(userId, {
      month: transaction.date.getDay(),
      year: transaction.date.getFullYear(),
    })

    // assert
    await expect(promise).rejects.toThrow()
  })

  it('should return empty array if no transactions are found', async () => {
    // arrange
    const userId = '1'
    await registerUseCase.execute(createUserParams)

    vi.spyOn(transactionRepository, 'findByUserId').mockResolvedValueOnce(null)

    // act
    const response = await sut.execute(userId, { month: 1, year: 2021 })

    // assert
    expect(response).toEqual([])
  })
})
