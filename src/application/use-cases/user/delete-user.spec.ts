import { inMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach, vi } from 'vitest'
import { RegisterUseCase } from './register'
import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'

describe('Register Use Case', () => {
  let usersRepository: inMemoryUsersRepository
  let createUserUseCase: RegisterUseCase
  let sut: DeleteUserUseCase
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository()
    createUserUseCase = new RegisterUseCase(usersRepository)
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should delete sucessfully', async () => {
    // arrange (Prepara o teste para ser executado)
    const { createdUser } = await createUserUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    })

    // act (Chama o controller a ser testado)
    const deleteUser = await sut.execute(createdUser.id)

    // assert (Fazer a sua expectativa de resultado)
    expect(deleteUser.user).toEqual(createdUser)
  })

  it('should call GetUserByIdRepository with correct params', async () => {
    // arrange (Prepara o teste para ser executado)
    const { createdUser } = await createUserUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    })

    const executeSpy = vi.spyOn(usersRepository, 'deleteUser')

    // act (Chama o controller a ser testado)
    await sut.execute(createdUser.id)

    // assert (Fazer a sua expectativa de resultado)
    expect(executeSpy).toHaveBeenCalledWith(createdUser.id)
  })

  it('should throw an error when repository execution fails ', async () => {
    // arrange
    const { createdUser } = await createUserUseCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    })

    vi.spyOn(usersRepository, 'deleteUser').mockRejectedValue(new Error())

    // act
    const promisse = sut.execute(createdUser.id)

    // expect
    expect(promisse).rejects.toThrow()
  })
})
