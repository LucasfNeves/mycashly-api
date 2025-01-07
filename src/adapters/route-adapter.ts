import { Request, Response } from 'express'
import { IController } from '../application/interfaces/IController'
import { TransactionType } from '@prisma/client'

// Currying
export function routeAdapter(controller: IController) {
  return async (request: Request, response: Response) => {
    try {
      const { statusCode, body } = await controller.handle({
        body: request.body,
        params: request.params,
        query: request.query as unknown as {
          month: number
          year: number
          type?: TransactionType
        },
        userId: request.metadata?.userId,
      })

      if (!response.headersSent) {
        response.status(statusCode).send(body)
      }
    } catch (error) {
      if (!response.headersSent) {
        response.status(500).send({ error: 'Internal server error' })
      }

      console.error(error)
    }
  }
}
