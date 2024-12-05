import { AuthenticationMiddleware } from '../application/middlewares/AuthenticationMiddleware'

export function makeAuthenticationMiddleware() {
  const authenticate = new AuthenticationMiddleware()

  return authenticate
}
