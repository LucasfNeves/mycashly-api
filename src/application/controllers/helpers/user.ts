import { userNotFound } from './http'

export const userNotFoundResponse = () => {
  return userNotFound({ errorMessage: 'User not found' })
}
