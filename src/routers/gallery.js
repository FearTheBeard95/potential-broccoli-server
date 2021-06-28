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

router.post('/gallery/photos', upload.array('photos', 6), urlencodedParser, async (req, res)=>{
    try {
        console.log(req.body.gallery)
        const gallery = await Gallerys.findById(req.body.gallery)
        console.log(req.files)
        console.log(gallery)
        if (gallery) {
            req.files.forEach(async (file) => {
                const photo = new Photos({
                    file: file.buffer,
                    gallery: req.body.gallery
                })

                await photo.save()
            });

            res.redirect(req.get('referer'))
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
            path: 'Photos'
        }).execPopulate()
        res.status(200).send({
            "gallery": gallery,
            "photos": gallery.Photos
        })
    } catch (error) {
        res.status(500).send('error.message')
    }
})

router.get('/gallery', async (req, res) => {
    try {
        const gallery = await Gallerys.find()

        if(!gallery){
            res.status(404).send('No galleries found')
        }
        res.status(200).send({
            "gallerys": gallery
        })
    } catch (error) {
        
    }
})

// get all photos

router.get('/photos', async (req, res) => {
    try {
        const photographs = await Photos.find()

        if(!photographs){
            res.send("No photos found")
        }
        res.status(200).send({
            photos: photographs
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/photos/:id', async (req, res) => {
    try {
        const photo = await Photos.findById(req.params.id)

        if (!photo || !photo.file) {
            return res.status(400).send('Photo not found')
        }
        res.set('Content-Type', 'image/png')
        res.send(photo.file)
    } catch (error) {
        res.status(500).send(error.message)
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