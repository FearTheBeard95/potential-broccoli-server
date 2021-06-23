const mongoose = require ('mongoose')

const photoSchema = new mongoose.Schema({
    file: {
        type: Buffer
    },
    gallery: {
        type: mongoose.Schema.Types.ObjectId
    },
    sliderImage: {
        type: Boolean
    }
})

photoSchema.methods.toJSON = function(){
    const photoObject = this.toObject()

    delete photoObject.file

    return photoObject
}

const Photos = mongoose.model('Photos', photoSchema)

module.exports = {
    Photos
}