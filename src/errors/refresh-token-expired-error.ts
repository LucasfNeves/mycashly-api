export class RefreshTokenExpiredError extends Error {
  constructor() {
    super('The refresh token has expired and is no longer valid.')
    this.name = 'RefreshTokenExpiredError'
  }
}
