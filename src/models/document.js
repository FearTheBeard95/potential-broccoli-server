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
    date: {
        type: Date,
        require: [true, 'The date the document was submitted is required']
    },
    abstract: {
        type: String,
        require: [true, "Please enter abstract for document"]
    },
    file: {
        type: Buffer,
        required: [true, 'The document is required']
    }
},{
    timestamps: true
})


documentSchema.methods.toJSON = function(){
    const documentObject = this.toObject()

    delete documentObject.file

    return documentObject
}

documentSchema.index({title: "text"})

const documents = mongoose.model('Documents', documentSchema)

module.exports = {
    documents
}