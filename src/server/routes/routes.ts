import {
  makeAuthenticateController,
  makeCreateUserController,
  makeUpdateUserController,
} from '../../factories/user'
import { routeAdapter } from '../../adapters/route-adapter'
import { Router } from 'express'
import { middlewareAdapter } from '../../adapters/middleware-adapter'
import { makeAuthenticationMiddleware } from '../../factories/make-authenticate-middleware'

export const router = Router()

router.post('/users', routeAdapter(makeCreateUserController()))

router.post('/sessions', routeAdapter(makeAuthenticateController()))

/** Authenticated */

router.patch(
  '/users/:userId',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeUpdateUserController()),
)
