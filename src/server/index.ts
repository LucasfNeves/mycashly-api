import dotenv from 'dotenv'
import express from 'express'
import { router } from './routes/routes'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'

dotenv.config()

const app = express()

app.use(express.json())

app.use(router)

const swaggerPath = path.resolve(__dirname, '../docs/swagger.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
