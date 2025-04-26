import { UserNotFoundError } from '../../../errors'
import { UsersRepository } from '../../repositories/interfaces/users-repository'

export interface TransactionsFilters {
  month: number
  year: number
}

export class GetUserBalanceFilteredUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(userId: string, filters: TransactionsFilters) {
    const { month, year } = filters

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError('User not found')
    }

    const balance = await this.userRepository.getUserBalanceFiltred(userId, {
      month,
      year,
    })

    return balance
  }
}
