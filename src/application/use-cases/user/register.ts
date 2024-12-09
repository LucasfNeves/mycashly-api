import { sign } from 'jsonwebtoken'
import { UserAlreadyExists } from '../../../errors/user-already-exists'
import { UsersRepository } from '../../repositories/interfaces/users-repository'
import bcrypt from 'bcryptjs'
import { env } from '../../../config/env'
interface RegisterUserUseCaseParams {
  email: string
  name: string
  password: string
}

interface RegisterUseCaseResponse {
  acessToken: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    params: RegisterUserUseCaseParams,
  ): Promise<RegisterUseCaseResponse> {
    const { name, email, password } = params

    const hasedPassword = await bcrypt.hash(password, 12)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExists()
    }

    const createdUser = await this.usersRepository.create({
      name,
      email,
      password: hasedPassword,
    })

    const acessToken = sign({ sub: createdUser.id }, env.jwtSecret!, {
      expiresIn: '7d',
    })

    return {
      acessToken,
    }
  }
}
