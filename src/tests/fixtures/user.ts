import { faker } from '@faker-js/faker'

export const user = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 7 }),
}
