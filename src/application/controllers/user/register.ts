import { UserAlreadyExists } from '../../../errors/user-already-exists'
import { env } from 'process'
import { z } from 'zod'
import { badRequest, created, serverError } from '../helpers/http'

import { createUserSchema } from '../../../schemas/user'
import { IController, IRequest, IResponse } from '../../interfaces/IController'

interface RegisterUserUseCaseParams {
  execute: (params: {
    email: string
    name: string
    password: string
  }) => Promise<{ accessToken: string; refreshTokenId: string }>
}

export class CreateUserController implements IController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCaseParams,
  ) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const { email, name, password } = await createUserSchema.parseAsync(body)

      const { accessToken, refreshTokenId } =
        await this.registerUserUseCase.execute({
          email,
          name,
          password,
        })

      return created({ accessToken, refreshTokenId })
    } catch (error) {
      if (error instanceof UserAlreadyExists) {
        return badRequest({
          message: error.message,
        })
      }

      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0].message
        return badRequest({ errorMessage })
      }

      if (env.NODE_ENV !== 'production') {
        console.error(error)
      } else {
        // TODO: Here we should log the error in a log service
      }

      return serverError()
    }
  }
}
