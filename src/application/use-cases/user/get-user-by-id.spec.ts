import { inMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach, vi } from 'vitest'
import { GetUserByIdUseCase } from './get-user-by-id'
import { RegisterUseCase } from './register'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { InMemoryRefreshTokenRepository } from '../../repositories/in-memory/in-memory-refresh-token-repository'
import { JwtAdapterImpl } from '../../../adapters/jwt-adapter'

describe('Register Use Case', () => {
  let usersRepository: inMemoryUsersRepository
  let createUserUseCase: RegisterUseCase
  let sut: GetUserByIdUseCase
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository()
    const refreshTokenRepository = new InMemoryRefreshTokenRepository()
    const jwtAdapter = new JwtAdapterImpl()
    createUserUseCase = new RegisterUseCase(
      usersRepository,
      refreshTokenRepository,
      jwtAdapter,
    )
    sut = new GetUserByIdUseCase(usersRepository)
  })

  it('should get user by id sucessfully', async () => {
    // arrange (Prepara o teste para ser executado)
    const userMock = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    }

    await createUserUseCase.execute({
      name: userMock.name,
      email: userMock.email,
      password: userMock.password,
    })

    // act (Chama o controller a ser testado)
    const result = await sut.execute('1')

    // assert (Fazer a sua expectativa de resultado)
    expect(result).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: '1',
          name: userMock.name,
          email: userMock.email,
        }),
      }),
    )
  })

  it('should call GetUserByIdRepository with correct params', async () => {
    // arrange (Prepara o teste para ser executado)
    await createUserUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    })

    const executeSpy = vi.spyOn(usersRepository, 'findById')

    // act (Chama o controller a ser testado)
    await sut.execute('1')

    // assert (Fazer a sua expectativa de resultado)
    expect(executeSpy).toHaveBeenCalledWith('1')
  })

  it('should throw an error when repository execution fails ', async () => {
    // arrange
    await createUserUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    })

    vi.spyOn(usersRepository, 'findById').mockRejectedValue(new Error())

    // act
    const promisse = sut.execute('1')

    // expect
    expect(promisse).rejects.toThrow()
  })

  it('should throw to userNotFound errors ', async () => {
    // arrange
    const userId = 'invalid_id'

    // act
    const promise = sut.execute(userId)

    // expect
    expect(promise).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
