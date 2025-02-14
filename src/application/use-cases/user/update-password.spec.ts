import { beforeEach, describe, expect, it } from 'vitest'
import { inMemoryUsersRepository } from '../../repositories/in-memory'
import { RegisterUseCase } from './register'
import { UpdatePasswordUseCase } from './update-password'
import { InMemoryRefreshTokenRepository } from '../../repositories/in-memory/in-memory-refresh-token-repository'
import { JwtAdapterImpl } from '../../../adapters/jwt-adapter'
import { user } from '../../../tests/fixtures'
import { InvalidCredentialsError, UserNotFoundError } from '../../../errors'
import { PasswordMustBeDifferentError } from '../../../errors/password-must-be-different-error'

describe('Update Password Use Case', () => {
  let usersRepository: inMemoryUsersRepository
  let registerUseCase: RegisterUseCase
  let sut: UpdatePasswordUseCase
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository()
    const refreshTokenRepository = new InMemoryRefreshTokenRepository()
    const jwtAdapter = new JwtAdapterImpl()
    registerUseCase = new RegisterUseCase(
      usersRepository,
      refreshTokenRepository,
      jwtAdapter,
    )
    sut = new UpdatePasswordUseCase(usersRepository)
  })

  const createUserParams = {
    ...user,
  }

  it('should update password sucessfully', async () => {
    // arrange (Prepara o teste para ser executado)

    const userId = '1'

    await registerUseCase.execute(createUserParams)

    // act (Chama o controller a ser testado)
    const { updatePassword } = await sut.execute(userId, {
      currentPassword: createUserParams.password,
      newPassword: 'newpassword',
    })

    // assert (Fazer a sua expectativa de resultado)
    expect(updatePassword).toBeTruthy()
  })

  it('should not update password with wrong current password', async () => {
    // arrange (Prepara o teste para ser executado)

    const userId = '1'

    await registerUseCase.execute(createUserParams)

    // act (Chama o controller a ser testado)

    const promise = sut.execute(userId, {
      currentPassword: 'wrongpassword',
      newPassword: 'newpassword',
    })

    // assert (Fazer a sua expectativa de resultado)
    expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not update password with same password', async () => {
    // arrange (Prepara o teste para ser executado)

    const userId = '1'

    await registerUseCase.execute(createUserParams)

    // act (Chama o controller a ser testado)

    const promise = sut.execute(userId, {
      currentPassword: createUserParams.password,
      newPassword: createUserParams.password,
    })

    // assert (Fazer a sua expectativa de resultado)
    expect(promise).rejects.toBeInstanceOf(PasswordMustBeDifferentError)
  })

  it('should not update password with wrong user id', async () => {
    // arrange (Prepara o teste para ser executado)

    await registerUseCase.execute(createUserParams)

    // act (Chama o controller a ser testado)

    const promise = sut.execute('2', {
      currentPassword: createUserParams.password,
      newPassword: 'newpassword',
    })

    // assert (Fazer a sua expectativa de resultado)
    expect(promise).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
