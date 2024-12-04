import { User } from '@prisma/client'
import { UsersRepository } from '../../repositories/interfaces/users-repository'
import { EmailAlreadyInUseError } from '../../../errors/email-already-in-use'
import { hash } from 'bcryptjs'

interface UpdateUseCasesParams {
  name?: string
  email?: string
  password?: string
}

interface UpdateUseCaseResponse {
  updateUser: User | null
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    userId: string,
    updatedUserParams: UpdateUseCasesParams,
  ): Promise<UpdateUseCaseResponse> {
    const { email, password } = updatedUserParams

    if (email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email)

      if (userWithSameEmail && userWithSameEmail.id !== userId) {
        throw new EmailAlreadyInUseError(email)
      }
    }

    const data = {
      ...updatedUserParams,
    }

    if (updatedUserParams.password) {
      const hasedPassword = await hash(password!, 12)

      data.password = hasedPassword
    }

    const updateUser = await this.usersRepository.updateUser(userId, data)

    return { updateUser }
  }
}
