import validator from 'validator'
import { z } from 'zod'

export const createtransactionSchema = z.object({
  categoryId: z
    .string({
      required_error: 'categoryId is required',
    })
    .uuid({
      message: 'Category ID must be a valid UUID',
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
      message: 'Type must be INCOME, EXPENSE, or INVESTMENT.',
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

export const updateTransactionSchema = z
  .object({
    categoryId: z
      .string()
      .uuid({
        message: 'Category ID must be a valid UUID',
      })
      .optional(),
    name: z
      .string()
      .trim()
      .min(1, {
        message: 'Name must not be empty.',
      })
      .optional(),
    date: z
      .string()
      .datetime({
        message: 'Date must be a valid date.',
      })
      .optional(),
    type: z
      .enum(['INCOME', 'EXPENSE', 'INVESTMENT'], {
        errorMap: () => ({
          message: 'Type must be INCOME, EXPENSE, or INVESTMENT.',
        }),
      })
      .optional(),
    value: z
      .number()
      .min(1, {
        message: 'Amount must be greater than 0.',
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
      )
      .optional(),
  })
  .strict({
    message: 'Some provided field is not allowed.',
  })

export const validateTransactionsQueryParams = z.object({
  month: z
    .number({
      required_error: 'Month is required',
      invalid_type_error: 'Month must be a number',
    })
    .int({
      message: 'Month must be an integer',
    })
    .refine((val) => val >= 0 && val <= 11, {
      message: 'Month must be between 0 (January) and 11 (December)',
    }),

  year: z
    .number({
      required_error: 'Year is required',
      invalid_type_error: 'Year must be a number',
    })
    .int({
      message: 'Year must be an integer',
    })
    .min(1900, {
      message: 'Year must be greater than or equal to 1900',
    })
    .max(new Date().getFullYear(), {
      message: `Year must be less than or equal to ${new Date().getFullYear()}`,
    }),

  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']).optional(),
})

export const validateTopFiveExpensesQueryParams =
  validateTransactionsQueryParams.omit({
    type: true,
  })
