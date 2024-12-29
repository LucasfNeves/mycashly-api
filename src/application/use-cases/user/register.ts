import { UserAlreadyExists } from '../../../errors/user-already-exists'
import { UsersRepository } from '../../repositories/interfaces/users-repository'
import bcrypt from 'bcryptjs'
import { PrismaRefreshTokenRepository } from '../../repositories/postgres/prisma-refresh-token-repository'
import {
  ACCESS_TOKEN_EXPIRATION,
  BCRYPT_SALT_ROUNDS,
  EXP_TIME_IN_DAYS,
} from '../../../config/constants'
import { calculateExpirationDate } from '../../../utils/calculate-expiration-date'
import { JwtAdapter } from '../../../adapters/jwt-adapter'
interface RegisterUserUseCaseParams {
  email: string
  name: string
  password: string
}

interface RegisterUseCaseResponse {
  accessToken: string
  refreshTokenId: string
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private readonly refreshTokenRepository: PrismaRefreshTokenRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  private async generateTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshTokenId: string }> {
    const accessToken = this.jwtAdapter.sign(
      { sub: userId },
      ACCESS_TOKEN_EXPIRATION,
    )
    const expiresAt = calculateExpirationDate(EXP_TIME_IN_DAYS)
    const { id: refreshTokenId } = await this.refreshTokenRepository.create(
      userId,
      expiresAt,
    )

    return { accessToken, refreshTokenId }
  }

  async execute(
    params: RegisterUserUseCaseParams,
  ): Promise<RegisterUseCaseResponse> {
    const { name, email, password } = params

    const hasedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExists()
    }

    const createdUser = await this.usersRepository.create({
      name,
      email,
      password: hasedPassword,
    })

    const { accessToken, refreshTokenId } = await this.generateTokens(
      createdUser.id,
    )

    return { accessToken, refreshTokenId }
  }
}
