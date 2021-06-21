import express from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import sharp from 'sharp'
import bodyParser from 'body-parser'
import auth from '../middleware/auth'
import {documents} from '../models/document'

const router = new express.Router()

const urlencodedParser = bodyParser.urlencoded({extended: false})

// Upload document file config
const upload = multer({
    limits: {
        fileSize: 50000000
    },
    fileFilter (req, file, cb){
        if(!file.originalname.toLocaleLowerCase().match(/\.pdf/)){
            return cb(new Error('Please upload a PDF file'))
        }
        cb(undefined, true)
    }
})

// Create document route
router.post('/documents',auth, urlencodedParser, upload.single('Document'), async(req, res)=>{
    try {
        const document = new documents({
            title: req.body.title,
            type: req.body.type,
            document: req.file.buffer
        })

        await document.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Download document
router.get('/document/file/:id', async (req, res) => {
    try {
        const document = await documents.findById(req.params.id)

        if(!document || !document.file){
            return res.status(400).send()
        }

        res.set('Content-Type', 'application/pdf')
        res.send(document.file)
    }catch(error){
        res.status(500).send(error.message)
    }
})

// delete Document
router.delete('/delete/:id', auth, async (req, res)=>{
    try {
        const document = await documents.findById(req.params.id)

        if(!document) res.status(404).send()
        await document.remove()
        res.status(200).send(document)
    } catch (error) {
        res.send(500).send()
    }
})

module.exports = router