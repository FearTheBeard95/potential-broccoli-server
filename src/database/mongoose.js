const mongoose = require('mongoose')

const URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/template'

mongoose.connect(URL,{
    useNewUrlParser: true,
    useCreateIndex: true
})