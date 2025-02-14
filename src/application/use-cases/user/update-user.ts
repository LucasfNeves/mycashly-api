import { UsersRepository } from '../../repositories/interfaces/users-repository'
import { EmailAlreadyInUseError } from '../../../errors/email-already-in-use'

interface UpdateUseCasesParams {
  name?: string
  email?: string
}

interface UpdateUseCaseResponse {
  updateUser: {
    id: string
    name: string
    email: string
  } | null
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    userId: string,
    updatedUserParams: UpdateUseCasesParams,
  ): Promise<UpdateUseCaseResponse> {
    const { email } = updatedUserParams

    if (email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email)

      if (userWithSameEmail && userWithSameEmail.id !== userId) {
        throw new EmailAlreadyInUseError(email)
      }
    }

    const data = {
      ...updatedUserParams,
    }

    const updateUser = await this.usersRepository.updateUser(userId, data)

    return { updateUser }
  }
}
