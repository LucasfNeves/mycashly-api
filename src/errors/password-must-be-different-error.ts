export class PasswordMustBeDifferentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PasswordMustBeDifferentError'
  }
}
