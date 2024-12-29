import { inMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach, vi } from 'vitest'
import { RegisterUseCase } from './register'
import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'
import { JwtAdapterImpl } from '../../../adapters/jwt-adapter'
import { InMemoryRefreshTokenRepository } from '../../repositories/in-memory/in-memory-refresh-token-repository'

describe('Register Use Case', () => {
  let usersRepository: inMemoryUsersRepository
  let createUserUseCase: RegisterUseCase
  let sut: DeleteUserUseCase
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository()
    const refreshTokenRepository = new InMemoryRefreshTokenRepository()
    const jwtAdapter = new JwtAdapterImpl()
    createUserUseCase = new RegisterUseCase(
      usersRepository,
      refreshTokenRepository,
      jwtAdapter,
    )
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should delete sucessfully', async () => {
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
    const deleteUser = await sut.execute('1')

    // assert (Fazer a sua expectativa de resultado)
    expect(deleteUser.user).toEqual(
      expect.objectContaining({
        id: '1', // ou um valor dinâmico gerado pelo teste
        name: userMock.name,
        email: userMock.email,
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

    const executeSpy = vi.spyOn(usersRepository, 'deleteUser')

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

    vi.spyOn(usersRepository, 'deleteUser').mockRejectedValue(new Error())

    // act
    const promisse = sut.execute('1')

    // expect
    expect(promisse).rejects.toThrow()
  })
})
