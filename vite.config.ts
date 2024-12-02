import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig(({ mode }) => {
  // Carrega todas as variáveis do .env (sem necessidade de prefixo VITE_)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    test: {
      // Agora, as variáveis estarão disponíveis
      globals: true,
      env,
      exclude: [...configDefaults.exclude, 'postgres-data/**'],
    },
  }
})
