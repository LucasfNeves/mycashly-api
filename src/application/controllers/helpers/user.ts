import { userNotFound } from './http'

/**
 * Generate a response for a user not found
 * @returns An object with a message indicating that the user was not found
 * @throws Return a user not found response with a message indicating that the user was not found
 * @throws Return error response with status code 404
 * @example
 * const response = userNotFoundResponse()
 * Returns: {
 *   errorMessage: 'User not found'
 * }
 */

export const userNotFoundResponse = () => {
  return userNotFound({ errorMessage: 'User not found' })
}
