import { UserAlreadyExists } from '../../../errors/user-already-exists'
import { env } from 'process'
import { z } from 'zod'
import { badRequest, serverError } from '../helpers/http'
import { User } from '@prisma/client'
import { createUserSchema } from '../../../schemas/user'

interface CreateUserRequest {
  body: {
    email: string
    name: string
    password: string
  }
}

interface RegisterUserUseCaseParams {
  execute: (params: {
    email: string
    name: string
    password: string
  }) => Promise<{ createdUser: User }>
}

export class CreateUserController {
  constructor(private registerUserUseCase: RegisterUserUseCaseParams) {}

  async register(httpRequest: CreateUserRequest) {
    try {
      const params = httpRequest.body

      await createUserSchema.parseAsync(params)

      const { email, name, password } = params

      const createdUser = await this.registerUserUseCase.execute({
        email,
        name,
        password,
      })

      return {
        statusCode: 201,
        body: createdUser,
      }
    } catch (error) {
      if (error instanceof UserAlreadyExists) {
        return badRequest({
          message: error.message,
        })
      }

      if (error instanceof z.ZodError) {
        return badRequest({
          message: error.errors[0].message,
        })
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
