import { env } from './env'
import express from 'express'
import { router } from './http/routes'

const app = express()

app.use(express.json())

app.use(router)

export { app }

const port = env.PORT

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
