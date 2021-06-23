const express = require('express')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const sharp = require('sharp')
const bodyParser = require('body-parser')
const auth = require('../middleware/auth')
const { Gallerys } = require('../models/gallery')
const { Photos } = require('../models/photo')

const router = express.Router()
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Upload photos config
const upload = multer({
    limits: {
        fileSize: 50000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.toLocaleLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png)'))
        }
        cb(undefined, true)
    }
})

router.post('/gallery', async (req, res) => {
    try {
        const gallery = new Gallerys({
            name: req.body.name
        })
        await gallery.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Add photos to library

router.post('/gallery/:id/photos', auth, upload.array('photos', 6), urlencodedParser, async (req, res)=>{
    try {
        const gallery = await Gallerys.findById(req.params.id)
        if (!gallery) {
            req.body.files.forEach(async (file) => {
                const photo = new photos({
                    file: file.buffer,
                    gallery: gallery._id
                })

                await photo.save()
            });

            res.status(200).send('Photos added')
        }
        res.status(500).send('gallery does not exist')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// get gallery photos

router.get('/gallery/:id', async (req, res) => {
    try {
        const gallery = await Gallerys.findById(req.params.id)

        await gallery.populate({
            path: 'photos'
        }).execPopulate()
        res.status(200).send({
            gallery,
            "photos": gallery.photos
        })
    } catch (error) {
        res.status(500).send()
    }
})

// delete gallery
router.delete('/gallery/:id', auth, async (req, res) => {
    try {
        const gallery = await Gallerys.findById(req.params.id)

        if (!gallery) {
            res.status(404).send('Cannot find gallery')
        }
        await gallery.remove()
        res.status(200).send(gallery)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// all photos
// get articles for a volume
router.get('/photos', async (req, res)=>{
    const match = {}
    let sort = {}

    if(req.query.sliderImage){
        match.sliderImage = req.query.sliderImage === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        const images = await Photos.find(match)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router