const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [true, 'The title is required'],
        trim: true
    },
    type: {
        type: String,
        require: [true, 'Specify the type of document'],
        trim: true
    },
    file: {
        type: Buffer,
        required: [true, 'The document is required']
    }
},{
    timestamps: true
})

const documents = mongoose.model('Documents', documentSchema)

module.exports = {
    documents
}