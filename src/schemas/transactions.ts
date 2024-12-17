import validator from 'validator'
import { z } from 'zod'

export const createtransactionSchema = z.object({
  categoryId: z
    .string({
      required_error: 'User_id is required',
    })
    .uuid({
      message: 'User ID must be a valid UUID',
    }),
  name: z
    .string({
      required_error: 'Name is required',
    })
    .trim()
    .min(1, {
      message: 'Name is required',
    }),
  date: z
    .string({
      required_error: 'Date is required',
    })
    .datetime({
      message: 'Date must be a valid date',
    }),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT'], {
    errorMap: () => ({
      message: 'Type must be EXPENSE, EARNING, or INVESTMENT.',
    }),
  }),
  value: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number.',
    })
    .min(1, {
      message: 'Amount must be greater than 0',
    })
    .refine(
      (value) =>
        validator.isCurrency(value.toFixed(2), {
          digits_after_decimal: [2],
          allow_negatives: false,
          decimal_separator: '.',
        }),
      {
        message:
          'Amount must be a valid currency format with 2 decimal places.',
      },
    ),
})

export const updateTransactionSchema = createtransactionSchema
  .partial()
  .strict({
    message: 'some provided field is not allowed.',
  })
