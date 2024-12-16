import { z } from 'zod'

export const createUserSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .trim()
    .min(1, {
      message: 'Name is required',
    }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Please provide a valide e-mail' })
    .trim()
    .min(1, {
      message: 'Email is required',
    }),
  password: z
    .string({
      required_error: 'Password is reuired',
    })
    .trim()
    .min(6, {
      message: 'Password must be have at least 6 characteres',
    }),
})

export const authenticateUserSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Please provide a valide e-mail' })
    .trim()
    .min(1, {
      message: 'Email is required',
    }),
  password: z
    .string({
      required_error: 'Password is reuired',
    })
    .trim()
    .min(6, {
      message: 'Password must be have at least 6 characteres',
    }),
})

export const updateUserSchema = createUserSchema.partial().strict({
  message: 'Some provided field is not allowed',
})