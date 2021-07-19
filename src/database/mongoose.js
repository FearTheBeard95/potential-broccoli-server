const mongoose = require('mongoose')

const URL = 'mongodb://localhost:27017/viva'

mongoose.connect(URL,{
    useNewUrlParser: true,
    useCreateIndex: true
})
