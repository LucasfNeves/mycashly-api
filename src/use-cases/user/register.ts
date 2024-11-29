import { UserAlreadyExists } from '@/errors/user-already-exists'
import { UsersRepository } from '@/repositories/users-repository'
import bcrypt from 'bcryptjs'

interface RegisterUseCasesParams {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(params: RegisterUseCasesParams) {
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

    return createdUser
  }
}
