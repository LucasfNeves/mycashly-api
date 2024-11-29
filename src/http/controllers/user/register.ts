import { UserAlreadyExists } from '@/errors/user-already-exists'
import { env } from 'process'
import { z } from 'zod'
import { badRequest } from '../helpers/http'

interface CreateUserRequest {
  body: {
    email: string
    name: string
    password: string
  }
}

interface CreateUserUseCase {
  execute(data: {
    email: string
    name: string
    password: string
  }): Promise<{ id: string; email: string; name: string }>
}

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async register(httpRequest: CreateUserRequest) {
    try {
      const { email, name, password } = httpRequest.body

      const createdUser = await this.createUserUseCase.execute({
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
          message: error.message,
        })
      }

      if (env.NODE_ENV !== 'production') {
        console.error(error)
      } else {
        // TODO: Here we should log the error in a log service
      }
    }
  }
}
