import {
  IMiddleware,
  IRequest,
  IResponse,
  IData,
} from '../interfaces/IMiddleware'
import { verify } from 'jsonwebtoken'
import { env } from '../../config/env'

interface Payload {
  sub: string
}

export class AuthenticationMiddleware implements IMiddleware {
  async handle({ headers }: IRequest): Promise<IResponse | IData> {
    const { authorization } = headers as Record<string, string>

    if (!authorization) {
      return {
        statusCode: 401,
        body: { error: 'Unauthorized' },
      }
    }

    const [bearer, token] = authorization.split(' ')

    try {
      if (bearer !== 'Bearer') {
        return {
          statusCode: 401,
          body: { error: 'Unauthorized' },
        }
      }

      const payload = verify(token, env.jwtSecret!) as Payload

      const { sub: userId } = payload

      if (!userId) {
        return {
          statusCode: 401,
          body: { error: 'Invalid Token' },
        }
      }

      return {
        data: {
          userId,
        },
      }
    } catch (error) {
      console.error(error)

      return {
        statusCode: 401,
        body: { error: 'Unauthorized' },
      }
    }
  }
}
