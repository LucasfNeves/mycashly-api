import { beforeEach, describe, expect, it } from 'vitest'
import { RefreshTokenUseCase } from './refresh-token-use-case'
import { InMemoryRefreshTokenRepository } from '../../repositories/in-memory/in-memory-refresh-token-repository'
import { JwtAdapterImpl } from '../../../adapters/jwt-adapter'
import { NotFoundException } from '../../../errors'
import { RefreshTokenExpiredError } from '../../../errors/refresh-token-expired-error'

describe('RefreshTokenUseCase', () => {
  let refreshTokenRepository: InMemoryRefreshTokenRepository
  let jwtAdapter = new JwtAdapterImpl()
  let sut: RefreshTokenUseCase
  beforeEach(() => {
    jwtAdapter = new JwtAdapterImpl()
    refreshTokenRepository = new InMemoryRefreshTokenRepository()

    sut = new RefreshTokenUseCase(refreshTokenRepository, jwtAdapter)
  })

  it('should refresh token successfully', async () => {
    const userId = 'user-test-id'
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Cria um refresh token antes de testar o caso de uso
    const createdToken = await refreshTokenRepository.create(userId, expiresAt)

    const result = await sut.execute(createdToken.id)

    expect(result).toHaveProperty('accessToken')
  })

  it('should throw an error if the token does not exist', async () => {
    const invalidTokenId = 'invalid-token-id'

    const promise = sut.execute(invalidTokenId)

    await expect(promise).rejects.toThrow(NotFoundException)
    await expect(promise).rejects.toThrow('Refresh token not found')
  })

  it('should throw an error if the token is expired', async () => {
    const userId = 'user-test-id'
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() - 7)

    // Cria um refresh token antes de testar o caso de uso
    const createdToken = await refreshTokenRepository.create(userId, expiresAt)

    const promise = sut.execute(createdToken.id)

    await expect(promise).rejects.toThrow(RefreshTokenExpiredError)
  })
})
