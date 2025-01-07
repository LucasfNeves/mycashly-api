import dotenv from 'dotenv'
import express from 'express'
import { router } from './routes/routes'
import swaggerUi from 'swagger-ui-express'

dotenv.config()

const app = express()

app.use(express.json())

app.use(router)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup())

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
