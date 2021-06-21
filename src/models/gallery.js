const mongoose = require ('mongoose')

const gallerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A name for the gallery is required'],
        trim: true
    }
},
{
    timestamps: true
})
gallerySchema.methods.toJSON = function () {
    const galleryObject = this.toObject()

    delete galleryObject.photos

    return galleryObject
}

// Link to photos
gallerySchema.virtual('photos', {
    ref: 'photos',
    localField: '_id',
    foreignField: 'gallery'
})

const Gallerys = mongoose.model('Gallery', gallerySchema)

module.exports = {
    Gallerys
}