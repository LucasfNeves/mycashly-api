import { JwtAdapter } from '../../../adapters/jwt-adapter'
import {
  ACCESS_TOKEN_EXPIRATION,
  EXP_TIME_IN_DAYS,
} from '../../../config/constants'
import { NotFoundException } from '../../../errors'
import { RefreshTokenExpiredError } from '../../../errors/refresh-token-expired-error'
import { PrismaRefreshTokenRepository } from '../../repositories/postgres/prisma-refresh-token-repository'
import { calculateExpirationDate } from '../../../utils/calculate-expiration-date'

export class RefreshTokenUseCase {
  constructor(
    private readonly prismaRefreshTokenRepository: PrismaRefreshTokenRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  private async handleRefreshTokenTransaction(userId: string, expiresAt: Date) {
    const [newRefreshToken, accessToken] = await Promise.all([
      this.prismaRefreshTokenRepository.create(userId, expiresAt),
      this.jwtAdapter.sign({ sub: userId }, ACCESS_TOKEN_EXPIRATION),
    ])

    return { accessToken, refreshToken: newRefreshToken.id }
  }

  async execute(refreshTokenId: string) {
    const refreshToken =
      await this.prismaRefreshTokenRepository.findById(refreshTokenId)

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found')
    }

    if (Date.now() > refreshToken.expiresAt.getTime()) {
      await this.prismaRefreshTokenRepository.deleteById(refreshToken.id)
      throw new RefreshTokenExpiredError()
    }

    const expiresAt = calculateExpirationDate(EXP_TIME_IN_DAYS)

    const { accessToken, refreshToken: newRefreshTokenId } =
      await this.handleRefreshTokenTransaction(refreshToken.userId, expiresAt)

    return { accessToken, refreshToken: newRefreshTokenId }
  }
}
