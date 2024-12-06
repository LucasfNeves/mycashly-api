import { UsersRepository } from '../../repositories/interfaces/users-repository'

interface GetUserByIdUseCaseResponse {
  user: {
    id: string
    name: string
    email: string
  } | null
}

export class GetUserByIdUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<GetUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    return {
      user,
    }
  }
}
