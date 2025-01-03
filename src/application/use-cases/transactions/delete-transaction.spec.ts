import { beforeEach, describe, expect, it, vi } from 'vitest'
import { transaction, user } from '../../../tests/fixtures'
import {
  inMemoryCategoriesRepository,
  inMemoryTransactionsRepository,
  inMemoryUsersRepository,
} from '../../repositories/in-memory'
import { RegisterUseCase } from '../user'
import { CreateTransactionUseCase, DeleteTransactionUseCase } from '.'
import { InMemoryRefreshTokenRepository } from '../../repositories/in-memory/in-memory-refresh-token-repository'
import { JwtAdapterImpl } from '../../../adapters/jwt-adapter'
import { NotFoundException } from '../../../errors'

describe('DeleteTransactionUseCase', () => {
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
  let sut: DeleteTransactionUseCase

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
    sut = new DeleteTransactionUseCase(transactionRepository)
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

  it('should delete transaction sucessfully', async () => {
    // arrange
    const userId = '1'
    const categoryId = '2'
    const transaction = await createAndRegisterUserTransaction(
      userId,
      categoryId,
    )

    // act
    const response = await sut.execute(transaction.id)

    // assert
    expect(response).toEqual({ ...transaction, id: transaction.id })
  })

  it('should call DeleteTransactionRepository with correct values', async () => {
    // arrange
    const userId = '1'
    const categoryId = '2'
    const transaction = await createAndRegisterUserTransaction(
      userId,
      categoryId,
    )

    const executeSpy = vi.spyOn(transactionRepository, 'delete')

    // act
    await sut.execute(transaction.id)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(transaction.id)
  })

  it('should throw if DeleteTransactionRepository throws', async () => {
    // arrange
    const userId = '1'
    const categoryId = '2'
    const transaction = await createAndRegisterUserTransaction(
      userId,
      categoryId,
    )

    vi.spyOn(transactionRepository, 'delete').mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(transaction.id)

    // assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw NotFoundException if transaction is not found', async () => {
    // arrange
    const transactionId = 'non-existent-id'

    // Mock o repositório para retornar null
    vi.spyOn(transactionRepository, 'delete').mockResolvedValueOnce(null)

    // act
    const promise = sut.execute(transactionId)

    // assert
    await expect(promise).rejects.toThrow(NotFoundException)
    await expect(promise).rejects.toThrow('Transaction not found')
  })
})
