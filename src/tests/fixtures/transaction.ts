import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

export const transaction = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  category_id: faker.string.uuid(),
  name: faker.commerce.productName(),
  date: faker.date.anytime().toISOString(),
  type: 'INCOME' as TransactionType,
  value: Number(faker.finance.amount()),
}

export const userBalance = {
  earnings: faker.finance.amount(),
  expenses: faker.finance.amount(),
  investments: faker.finance.amount(),
  balance: faker.finance.amount(),
}
