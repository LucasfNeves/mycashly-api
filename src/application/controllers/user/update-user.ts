import { badRequest, ok, serverError } from '../helpers/http'
import { updateUserSchema } from '../../../schemas/user'
import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { UpdateUserUseCase } from '../../use-cases/user/update-user'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { EmailAlreadyInUseError } from '../../../errors/email-already-in-use'
import { ZodError } from 'zod'

export class UpdateUserController implements IController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  async handle({ body, params }: IRequest): Promise<IResponse> {
    try {
      const userId: string = params?.userId as string

      console.log(userId)

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

      console.log(error)
      return serverError()
    }
  }
}
