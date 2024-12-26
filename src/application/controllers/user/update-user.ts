import { badRequest, ok, serverError, userNotFound } from '../helpers/http'
import { updateUserSchema } from '../../../schemas/user'
import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { UpdateUserUseCase } from '../../use-cases/user/update-user'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { EmailAlreadyInUseError } from '../../../errors/email-already-in-use'
import { ZodError } from 'zod'
import { UserNotFoundError } from '../../../errors/user-not-found-error'

export class UpdateUserController implements IController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  async handle({ body, userId }: IRequest): Promise<IResponse> {
    try {
      if (!userId) {
        throw new UserNotFoundError()
      }

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      const updatedUserParams = await updateUserSchema.parseAsync(body)

      const updateUser = await this.updateUserUseCase.execute(
        userId,
        updatedUserParams,
      )

      return ok({ ...updateUser })
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return userNotFound({ errorMessage: 'User not found' })
      }

      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        })
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({
          message: error.message,
        })
      }

      return serverError()
    }
  }
}
