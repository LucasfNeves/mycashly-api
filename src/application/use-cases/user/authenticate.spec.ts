import { inMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { faker } from '@faker-js/faker'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../../../errors/Invalid-credentials-error'

describe('Authenticate User Use Case', () => {
  let usersRepository: inMemoryUsersRepository
  let sut: AuthenticateUseCase
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    // arrange (Prepara o teste para ser executado)
    const email = faker.internet.email()

    await usersRepository.create({
      name: faker.person.fullName(),
      email,
      password: await hash('123456', 12),
    })

    // act (Chama o controller a ser testado)
    const { acessToken } = await sut.execute({
      email,
      password: '123456',
    })

    // assert (Fazer a sua expectativa de resultado)
    expect(acessToken).toBeTruthy()
  })

  it('should not be able to autheticate with wrong email', async () => {
    // arrange (Prepara o teste para ser executado)

    // act (Chama o controller a ser testado)
    const promise = sut.execute({
      email: faker.internet.email(),
      password: faker.internet.password(),
    })

    // assert (Fazer a sua expectativa de resultado)
    expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to autheticate with wrong password', async () => {
    // arrange (prepara o teste para ser executado)

    const email = faker.internet.email()

    await usersRepository.create({
      name: faker.person.fullName(),
      email,
      password: await hash('123456', 12),
    })

    // act (chama o controller a ser testado)
    const promise = sut.execute({
      email,
      password: '123123', // senha errada
    })

    // assert (faz a expectativa de resultado)
    await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
