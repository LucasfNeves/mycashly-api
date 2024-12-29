import { RefreshToken } from '@prisma/client'
import { RefreshTokenRepository } from '../interfaces/refresh-token-repository'

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  private refreshTokens: RefreshToken[] = []

  // Criação de um novo refresh token
  async create(userId: string, expiresAt: Date): Promise<RefreshToken> {
    const refreshToken: RefreshToken = {
      id: Math.random().toString(36).substring(2), // Gerar um ID aleatório
      userId,
      expiresAt,
      issuedAt: new Date(),
    }

    // Adicionando o refresh token ao array em memória
    this.refreshTokens.push(refreshToken)

    return refreshToken
  }

  // Deletando o refresh token pelo ID
  async deleteById(id: string): Promise<void> {
    const index = this.refreshTokens.findIndex((token) => token.id === id)
    if (index !== -1) {
      this.refreshTokens.splice(index, 1) // Remover o token
    }
  }

  // Encontrar um refresh token pelo ID
  async findById(id: string): Promise<RefreshToken | null> {
    const refreshToken = this.refreshTokens.find((token) => token.id === id)
    return refreshToken || null // Retorna o token ou null se não encontrado
  }
}
