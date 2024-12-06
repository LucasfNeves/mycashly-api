import { UsersRepository } from '../../repositories/interfaces/users-repository'

interface DeleteUserUseCaseUseCaseResponse {
  user: {
    id: string
    name: string
    email: string
  } | null
}

export class DeleteUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<DeleteUserUseCaseUseCaseResponse> {
    const user = await this.usersRepository.deleteUser(userId)

    return {
      user,
    }
  }
}
