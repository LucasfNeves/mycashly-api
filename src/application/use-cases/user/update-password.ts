import { compare, hash } from 'bcryptjs'
import { UsersRepository } from '../../repositories/interfaces/users-repository'
import { userNotFoundResponse } from '../../controllers/helpers/user'
import { PasswordMustBeDifferentError } from '../../../errors/password-must-be-different-error'
import { InvalidCredentialsError } from '../../../errors'

interface UpdatePasswordUseCaseParams {
  currentPassword: string
  newPassword: string
}

interface UpdatePasswordUseCaseResponse {
  updatePassword: {
    password: string
  } | null
}

export class UpdatePasswordUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(
    userId: string,
    updatePasswordParams: UpdatePasswordUseCaseParams,
  ): Promise<UpdatePasswordUseCaseResponse> {
    const { currentPassword, newPassword } = updatePasswordParams

    if (currentPassword === newPassword) {
      throw new PasswordMustBeDifferentError(
        'The new password must be different from the current password',
      )
    }

    const user =
      await this.usersRepository.getUserWithPasswordByIdRepository(userId)

    if (!user) {
      throw userNotFoundResponse()
    }

    const doesPasswordMatches = await compare(currentPassword, user.password)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    const hashedPassword = await hash(newPassword, 12)

    const updatePassword = await this.usersRepository.updatePassword(
      userId,
      hashedPassword,
    )

    return { updatePassword }
  }
}
