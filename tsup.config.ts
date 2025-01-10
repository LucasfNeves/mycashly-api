import { defineConfig } from 'tsup'

export default defineConfig({
  external: ['vitest', '@faker-js/faker'],
})
