import { Router } from 'express'
import type { Request, Response } from 'express'
import {
  makeAuthenticateController,
  makeCreateUserController,
} from '../factories/user'

export const router = Router()

router.post('/users', async (request: Request, response: Response) => {
  const createUserController = makeCreateUserController()

  const createUserResponse = await createUserController.register(request)

  // Verifique se createUserResponse não é undefined
  if (!createUserResponse) {
    response.status(500).send({ message: 'Internal server error' })
    return
  }

  response.status(createUserResponse.statusCode).send(createUserResponse.body)
})

router.post('/sessions', async (request: Request, response: Response) => {
  const createAuthenticateController = makeAuthenticateController()

  const uthenticateResponse =
    await createAuthenticateController.execute(request)

  response.status(uthenticateResponse.statusCode).send(uthenticateResponse.body)
})
