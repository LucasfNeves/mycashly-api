import { inMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { faker } from '@faker-js/faker'
import { UserAlreadyExists } from '../../errors/user-already-exists'

describe('Register Use Case', () => {
  it('should create a new user', async () => {
    // arrange (Prepara o teste para ser executado)
    const usersRepository = new inMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    // act (Chama o controller a ser testado)
    const { createdUser } = await registerUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    })

    // assert (Fazer a sua expectativa de resultado)
    expect(createdUser).toBeTruthy()
  })

  it('should hash user password upon registration', async () => {
    // arrange (Prepara o teste para ser executado)
    const usersRepository = new inMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    // act (Chama o controller a ser testado)
    const { createdUser } = await registerUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', createdUser.password)

    // assert (Fazer a sua expectativa de resultado)
    expect(isPasswordHashed).toBe(true)
  })

  it('should not allow two users with the same email', async () => {
    // arrange (Prepara o teste para ser executado)
    const usersRepository = new inMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = faker.internet.email()

    // act (Chama o controller a ser testado)
    await registerUseCase.execute({
      name: faker.person.fullName(),
      email: email,
      password: faker.internet.password({ length: 7 }),
    })

    // assert (Fazer a sua expectativa de resultado)
    await expect(() =>
      registerUseCase.execute({
        name: faker.person.fullName(),
        email: email,
        password: faker.internet.password({ length: 7 }),
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExists)
  })
})
