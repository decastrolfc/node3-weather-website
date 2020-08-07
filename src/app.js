const path = require('path')
const express = require('express');
const hbs = require('hbs')
const app = express()
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlerbars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to Serve
app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Jorge De Castro'
    })
})

app.get('/about', (req,res) =>{
    res.render('about', {
        title: 'About me',
        name: 'Jorge De Castro'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        helpText: 'This is some helpful text',
        name: 'Jorge De Castro',
        telephone: '+351 914298844'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, placeName}={})=>{
        if(error) {
            return res.send({
                error: error 
            })
        }
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({
                        error: error
                    })
                }

                res.send({
                    forecast: forecastData,
                    location: placeName,
                    address: req.query.address
            })
    })


    })
})

app.get('/products', (req, res) =>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res)=>{
    res.render('404page', {
        errorMessage: 'Help article not found'
    })
})

app.get('*',(req, res) =>{
    res.render('404page', {
        title: '404',
        errorMessage: 'Page not found',
        name: 'Jorge De Castro'
    })
})
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})