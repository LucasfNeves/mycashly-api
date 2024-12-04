export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`The provided e-mail ${email} is already in use`)
    this.name = 'EmailAlreadyInUseError'
  }
}
