import { UserNotFoundError } from '../../../errors'
import { UsersRepository } from '../../repositories/interfaces/users-repository'

export class GetUserBalanceUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError('User not found')
    }

    const balance = await this.userRepository.getUserBalance(userId)

    return balance
  }
}
