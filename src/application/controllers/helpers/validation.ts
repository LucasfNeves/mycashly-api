import validator from 'validator'
import { badRequest } from './http'

/**
 * Check if the provided id is valid
 * @param userId - The id to be validated
 * @returns A boolean indicating if the id is valid
 * @example
 * const idIsValid = checkIfIdIsValid('123e4567-e89b-12d3-a456-426614174000')
 * Returns: true
 * @example
 * const idIsValid = checkIfIdIsValid('Invalid_uuid')
 * Returns: false
 *
 */

export const checkIfIdIsValid = (userId: string) => validator.isUUID(userId)

/**
 * Generate a response for an invalid id
 * @returns An object with a message indicating that the provided id is not valid
 * @throws Return a bad request response with a message indicating that the provided id is not valid
 * @throws Return error response with status code 400
 * @example
 * const response = generateInvalidIdResponse()
 * Returns: {
 *   message: 'The provided id is not valid'
 * }
 */

export const generateInvalidIdResponse = () => {
  return badRequest({
    message: 'The provided id is not valid',
  })
}
