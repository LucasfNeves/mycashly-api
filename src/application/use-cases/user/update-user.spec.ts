import { inMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach, vi } from 'vitest'
import { RegisterUseCase } from './register'
import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'
import { compare } from 'bcryptjs'
import { EmailAlreadyInUseError } from '../../../errors/email-already-in-use'

describe('Update User Use Case', () => {
  let usersRepository: inMemoryUsersRepository
  let registerUseCase: RegisterUseCase
  let sut: UpdateUserUseCase
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('should update user sucessfully without email, password and name', async () => {
    // arrange (Prepara o teste para ser executado)

    const userId = '1'

    await registerUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    })

    // act (Chama o controller a ser testado)
    const { updateUser } = await sut.execute(userId, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    })

    // assert (Fazer a sua expectativa de resultado)
    expect(updateUser).toBeTruthy()
  })

  it('should update user sucessfully (with email)', async () => {
    // arrange (Prepara o teste para ser executado)

    const userId = '1'

    const getUserByEmailRespositorySpy = vi.spyOn(
      usersRepository,
      'findByEmail',
    )

    const email = faker.internet.email()

    await registerUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    })

    // act (Chama o controller a ser testado)
    const { updateUser } = await sut.execute(userId, {
      email: email,
    })

    // assert (Fazer a sua expectativa de resultado)
    expect(getUserByEmailRespositorySpy).toHaveBeenCalledWith(email)
    expect(updateUser).toBeTruthy()
  })

  it('should update user sucessfully (with password)', async () => {
    // arrange (Prepara o teste para ser executado)

    const userId = '1'

    await registerUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })

    // act (Chama o controller a ser testado)
    const { updateUser } = await sut.execute(userId, {
      password: '123456',
    })

    if (updateUser) {
      await compare('123456', updateUser.password)
    }

    // assert (Fazer a sua expectativa de resultado)
    expect(updateUser).toBeTruthy()
  })

  it('should throw EmailAlreadyInUseError if email is already in use', async () => {
    // arrange (Prepara o teste para ser executado)
    const userId = '1'

    const email = faker.internet.email()

    await registerUseCase.execute({
      name: faker.person.fullName(),
      email: email,
      password: faker.internet.password(),
    })

    vi.spyOn(usersRepository, 'findByEmail').mockImplementation(async () => ({
      id: '2',
      name: faker.person.fullName(),
      email: email,
      password: faker.internet.password(),
    }))

    // act (Chama o controller a ser testado)
    const promise = sut.execute(userId, {
      email: email,
    })

    // assert (Fazer a sua expectativa de resultado)
    await expect(promise).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })
})
