import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../../errors/user-already-exists copy'
import { UsersRepository } from '../../repositories/users-repository'

interface AuthenticateUseCaseParams {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: {
    id: string
    name: string
    email: string
    password: string
  }
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseParams): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
