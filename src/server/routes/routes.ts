import { Router } from 'express'
import {
  makeAuthenticateController,
  makeCreateUserController,
  makeUpdateUserController,
} from '../../factories/user'
import { routeAdapter } from '../../adapters/route-adapter'

export const router = Router()

router.post('/users', routeAdapter(makeCreateUserController()))

router.post('/sessions', routeAdapter(makeAuthenticateController()))

router.patch('/users/:userId', routeAdapter(makeUpdateUserController()))

/** Authenticated */
