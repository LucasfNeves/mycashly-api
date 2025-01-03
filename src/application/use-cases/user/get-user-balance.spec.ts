import { beforeEach, describe, expect, it, vi } from 'vitest'
import { inMemoryUsersRepository } from '../../repositories/in-memory'
import { RegisterUseCase } from './register'
import { GetUserBalanceUseCase } from './get-user-balance'
import { InMemoryRefreshTokenRepository } from '../../repositories/in-memory/in-memory-refresh-token-repository'
import { JwtAdapterImpl } from '../../../adapters/jwt-adapter'
import { user as mockUser } from '../../../tests/fixtures'
import { UserNotFoundError } from '../../../errors'

describe('GetUserBalanceUseCase', () => {
  const mockCreateUserParams = {
    ...mockUser,
  }

  let usersRepository: inMemoryUsersRepository
  let registerUserUseCase: RegisterUseCase
  let sut: GetUserBalanceUseCase
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository()
    const refreshTokenRepository = new InMemoryRefreshTokenRepository()
    const jwtAdapter = new JwtAdapterImpl()
    registerUserUseCase = new RegisterUseCase(
      usersRepository,
      refreshTokenRepository,
      jwtAdapter,
    )
    sut = new GetUserBalanceUseCase(usersRepository)
  })

  it('should return user balance successfully', async () => {
    // Arrange: Criar um usuário para o teste
    const userId = '1'
    await registerUserUseCase.execute(mockCreateUserParams)

    // Act: Obter o saldo do usuário criado
    const userBalance = await sut.execute(userId)

    // Assert: Verificar se o saldo retornado está correto
    expect(userBalance).toEqual({
      balance: 0,
      expenses: 0,
      incomes: 0,
      investments: 0,
    })
  })

  it('should throw UsernotFoundError if GetUserByIdRepository returns null ', async () => {
    //arrange
    vi.spyOn(usersRepository, 'findById').mockResolvedValue(null)

    //act
    const promisse = sut.execute('invalid_id')

    //assert
    await expect(promisse).rejects.toThrow(
      new UserNotFoundError('User not found'),
    )
  })

  it('should call GetUserByIdRepository with correct params ', async () => {
    //arrange
    const userId = '1'
    await registerUserUseCase.execute(mockCreateUserParams)
    const getUserRepositorySpy = vi.spyOn(usersRepository, 'findById')

    //act
    await sut.execute(userId)

    //assert
    expect(getUserRepositorySpy).toHaveBeenCalledWith(userId)
  })

  it('should call GetUserBalanceRepository with correct params ', async () => {
    //arrange
    const userId = '1'
    await registerUserUseCase.execute(mockCreateUserParams)
    const getUserBalanceRepositorySpy = vi.spyOn(
      usersRepository,
      'getUserBalance',
    )

    //act
    await sut.execute(userId)

    //assert
    expect(getUserBalanceRepositorySpy).toHaveBeenCalledWith(userId)
  })

  it('should throw if GetUserByIdRepository throws ', async () => {
    //arrange
    const userId = '1'
    await registerUserUseCase.execute(mockCreateUserParams)

    vi.spyOn(usersRepository, 'findById').mockRejectedValue(new Error())

    //act
    const promise = sut.execute(userId)

    //assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw if GetUserBalanceRepository throws ', async () => {
    //arrange
    const userId = '1'
    await registerUserUseCase.execute(mockCreateUserParams)

    vi.spyOn(usersRepository, 'getUserBalance').mockRejectedValue(new Error())

    //act
    const promise = sut.execute(userId)

    //assert
    await expect(promise).rejects.toThrow()
  })
})
