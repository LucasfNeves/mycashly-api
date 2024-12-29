import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../../../errors/Invalid-credentials-error'
import { UsersRepository } from '../../repositories/interfaces/users-repository'
import { PrismaRefreshTokenRepository } from '../../repositories/postgres/prisma-refresh-token-repository'
import {
  ACCESS_TOKEN_EXPIRATION,
  EXP_TIME_IN_DAYS,
} from '../../../config/constants'
import { calculateExpirationDate } from '../../../utils/calculate-expiration-date'
import { JwtAdapter } from '../../../adapters/jwt-adapter'

interface AuthenticateUseCaseParams {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  accessToken: string
  refreshTokenId: string
}

export class AuthenticateUseCase {
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

    const { accessToken, refreshTokenId } = await this.generateTokens(user.id)

    return { accessToken, refreshTokenId }
  }
}
