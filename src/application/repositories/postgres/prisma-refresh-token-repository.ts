import { prisma } from '../../../lib/prisma'
import { RefreshTokenRepository } from '../interfaces/refresh-token-repository'

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  async create(userId: string, expiresAt: Date) {
    const refreshToken = await prisma.refreshToken.create({
      data: {
        userId,
        expiresAt,
      },
    })

    return refreshToken
  }

  async findById(id: string) {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        id,
      },
    })

    return refreshToken
  }

  async deleteById(id: string) {
    await prisma.refreshToken.delete({
      where: {
        id,
      },
    })
  }
}
