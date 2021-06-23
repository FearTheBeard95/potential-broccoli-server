const express = require('express')
const path = require('path')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')
const bodyParser =require('body-parser')
const nodemailer = require('nodemailer')
const userRoute = require('./routers/user')
const documentRoute = require('./routers/document')
const galleryRoute = require('./routers/gallery')
const mongoose = require('./database/mongoose')
const auth = require('../src/middleware/auth')

const publicPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
const scriptPath = path.join(__dirname,'../src/js')
const app = express()

app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use('/js',express.static(scriptPath))
app.use(cookieParser())
hbs.registerPartials(partialsPath)

app.use(express.static(publicPath))

app.use(express.json())

app.use(documentRoute)
app.use(galleryRoute)
app.use(userRoute)

const urlencodedParser = bodyParser.urlencoded({extended: false})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'namsocialjustice@gmail.com',
        pass: 'Namsocial@123'
    }
})

app.get('',(req, res) => {
    res.render('index')
})

app.get('/researchreports',(req, res) => {
    res.render('researchreports')
})

app.get('/opinionpieces',(req, res) => {
    res.render('opinionpieces')
})

app.get('/articlesworkshop',(req, res) => {
    res.render('articlesworkshop')
})

app.get('/gallery',(req, res) => {
    res.render('gallery')
})

app.get('/search', async (req, res)=>{
    const query = {$text: {$search: req.query.term}}
    const articleAll = await articles.find(query)

    if(!articleAll) {
        res.render('search',{result: "none"})
    }
    res.render('search', {result: req.query.term})
})

app.get('/contact',(req, res)=> {
    res.render('contact')
})
app.post('/contact', urlencodedParser, (req, res)=>{
    try {
        const today = Date.now()
        const date = new Date(today)
        const maillist = ['vivaworkers@gmail.com', 'rinaanim@yahoo.com']

        maillist.forEach((to)=>{
            const mailOptions = {
                from: 'namsocialjustice@gmail.com',
                to: to,
                subject: 'Query from namsocialjustice.org',
                text: `
                    From: ${req.body.email}
    
                    Name: ${req.body.firstname} ${req.body.surname}
    
                    Message: ${req.body.message}
    
                    Sent on: ${date}
                `
            }
            
            transporter.sendMail(mailOptions, (error, info) => {
                if(error) res.render('404')
                else res.render('contact')
            })
        })

    } catch (error) {
        
    }
})

module.exports = app