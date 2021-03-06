const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('',(req, res)=> {
    res.render('index',{
        title: 'Weather',
        name: 'Aditya'
    })
})

app.get('/about',(req, res) => {
    res.render('about',{
        title: 'About me',
        message: 'My name is Aditya ',
        name: 'Aditya'
    })
})

app.get('/help',(req, res) => {
    res.render('help',{
        title: 'Help',
        message: 'This is help message',
        name: 'Aditya'
    })
})

app.get('/weather',(req, res)=>{
   if(!req.query.address){
       return res.send({
           error: 'Enter the address'
       })
   }
   geocode(req.query.address,(error, {latitude, longitude, location}={})=>{//tut = 40 
    if(error){
        return res.send({error: error})
    }
  
    forecast(latitude,longitude, (error, forecastData) => {
      if(error){
        return res.send({error: error})
      }
  
      res.send({
        forecast: forecastData,
        location: location,
        address: req.query.address
   })
    })
  })
})

app.get('/pro',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error:'This is a Error'
        })
    }
    res.send({
        product: []
    })
})


app.get('/help/*',(req, res)=>{
    res.render('404page',{
        title: '404',
        errorMessage: 'Help article not found',
        name: ' Aditya'
    })
})

app.get('*',(req, res)=>{
    res.render('404page',{
        title: '404',
        errorMessage: 'Page not found',
        name: ' Aditya'
    })
})

app.listen(port,()=>{
    console.log('Server is up on port'+port)
})
//complete