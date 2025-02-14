import { compare, hash } from 'bcryptjs'
import { UsersRepository } from '../../repositories/interfaces/users-repository'
import { PasswordMustBeDifferentError } from '../../../errors/password-must-be-different-error'
import { InvalidCredentialsError, UserNotFoundError } from '../../../errors'

interface UpdatePasswordUseCaseParams {
  currentPassword: string
  newPassword: string
}

interface UpdatePasswordUseCaseResponse {
  updatePassword: {
    id: string
    name: string
    email: string
  } | null
}

export class UpdatePasswordUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(
    userId: string,
    updatePasswordParams: UpdatePasswordUseCaseParams,
  ): Promise<UpdatePasswordUseCaseResponse> {
    const { currentPassword, newPassword } = updatePasswordParams

    const user =
      await this.usersRepository.getUserWithPasswordByIdRepository(userId)

    if (!user || !user.password) {
      throw new UserNotFoundError()
    }

    console.log('Senha informada pelo usuário:', currentPassword)
    console.log('Senha salva no banco:', user.password)

    const doesPasswordMatch = await compare(currentPassword, user.password)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    const isSamePassword = await compare(newPassword, user.password)

    if (isSamePassword) {
      throw new PasswordMustBeDifferentError(
        'The new password must be different from the current password',
      )
    }

    const hashedPassword = await hash(newPassword, 12)
    console.log('Novo hash gerado:', hashedPassword)

    const updatePassword = await this.usersRepository.updatePassword(
      userId,
      hashedPassword,
    )

    return { updatePassword }
  }
}
