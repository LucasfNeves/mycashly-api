import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CreateTransactionUseCase, UpdateTransactionUseCase } from './index'
import { RegisterUseCase } from '../user/index'

import { transaction, user } from '../../../tests/fixtures/index'

import {
  inMemoryUsersRepository,
  inMemoryCategoriesRepository,
  inMemoryTransactionsRepository,
} from '../../repositories/in-memory/index'

import { NotFoundException } from '../../../errors/index'
import { TransactionType } from '@prisma/client'
import { InMemoryRefreshTokenRepository } from '../../repositories/in-memory/in-memory-refresh-token-repository'
import { JwtAdapterImpl } from '../../../adapters/jwt-adapter'

describe('Create Transaction Use Case', () => {
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
  let sut: UpdateTransactionUseCase

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
    sut = new UpdateTransactionUseCase(
      transactionRepository,
      categoryRepository,
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

  const mockRepositoryUpdateToThrow = (error: Error) => {
    vi.spyOn(transactionRepository, 'update').mockRejectedValue(error)
  }

  const createUpdateTransactionParams = (
    transaction: Record<string, unknown>,
    categoryId: string,
  ) => ({
    ...transaction,
    name: 'new name',
    value: 100,
    date: new Date(),
    type: 'EXPENSE' as TransactionType,
    categoryId,
  })

  it('should update transaction successfully', async () => {
    // arrange

    const transaction = await createAndRegisterUserTransaction('1', '3')

    const updateTransactionParams = createUpdateTransactionParams(
      transaction,
      '4',
    )

    // act
    const updatedTransaction = await sut.execute(
      transaction.id,
      '1',
      updateTransactionParams,
    )

    const expectedTransaction = {
      ...updateTransactionParams,
      id: transaction.id,
    }

    // assert
    expect(updatedTransaction).toEqual(expectedTransaction)
  })

  it('should call updateTransactionRepository with correct values', async () => {
    // arrange
    const transaction = await createAndRegisterUserTransaction('1', '3')

    const updateTransactionParams = createUpdateTransactionParams(
      transaction,
      '4',
    )

    const updateTransactionRepositorySpy = vi.spyOn(
      transactionRepository,
      'update',
    )

    // act
    await sut.execute(transaction.id, '1', updateTransactionParams)

    // assert
    expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
      transaction.id,
      {
        name: 'new name',
        value: 100,
        date: updateTransactionParams.date,
        type: 'EXPENSE',
        category: { connect: { id: '4' } },
      },
    )
  })

  it('should throw if updateTransactionRepository throws', async () => {
    // arrange

    const transaction = await createAndRegisterUserTransaction('1', '3')

    const updateTransactionParams = createUpdateTransactionParams(
      transaction,
      '4',
    )

    mockRepositoryUpdateToThrow(new Error('Error'))

    // act
    const promise = sut.execute(transaction.id, '1', updateTransactionParams)

    // assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw NotFoundException if categoryId not found', async () => {
    // arrange
    const transaction = await createAndRegisterUserTransaction('1', '3')

    const updateTransactionParams = createUpdateTransactionParams(
      transaction,
      'invalid_category_id',
    )

    mockRepositoryUpdateToThrow(new NotFoundException('Category not found'))

    // act
    const promise = sut.execute(transaction.id, '1', updateTransactionParams)

    // assert
    await expect(promise).rejects.toThrow(NotFoundException)
  })
})
