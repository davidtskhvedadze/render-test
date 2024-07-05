const express = require('express')
const app = express()
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = config.MONGODB_URL
logger.info('connecting to', url)

mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })



app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


app.listen(config.PORT, () => {
  logger.info(`Listening on ${config.PORT}`)
})