import { RefreshToken } from '@prisma/client'

export interface RefreshTokenRepository {
  create(userId: string, expiresAt: Date): Promise<RefreshToken>
  findById(id: string): Promise<RefreshToken | null>
  deleteById(id: string): Promise<void>
}
