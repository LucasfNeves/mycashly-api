import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../../../errors/Invalid-credentials-error'
import { UsersRepository } from '../../repositories/interfaces/users-repository'
import { sign } from 'jsonwebtoken'
import { env } from '../../../config/env'

interface AuthenticateUseCaseParams {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  acessToken: string
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

    const acessToken = sign({ sub: user.id }, env.jwtSecret!, {
      expiresIn: '1d',
    })

    return { acessToken }
  }
}
