const express = require("express");
const router =require('./routers/router.js')
const handlebars = require('express-handlebars')

const PORT = 8060
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/productos', router)

app.use('/upload', express.static('upload'))

// Configuración Handlebars
app.engine('hbs', 
    handlebars({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir:__dirname+'/views/layouts',
        partialsDir: __dirname+'/views/partials'
    }))

app.set('views', './views')
app.set('view engine', 'hbs')

// Ruta raíz
app.get('', (req, res)=>{
    res.render('main')
})

app.listen(PORT, () =>{
    console.log('Servidor OK')
})