const express = require('express')
const userRoute = require('./routers/user')
const mongoose = require('./database/mongoose')
const auth = require('../src/middleware/auth')

const app = express()

app.use(express.json())
app.use(userRoute)

module.exports = app