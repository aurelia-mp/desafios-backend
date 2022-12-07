const express = require("express");
const routerProductos =require('./routers/routerProductos.js')
const handlebars = require('express-handlebars')
const routerCarrito = require('./routers/routerCarrito')

const PORT = process.env.PORT || 8080
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Routers
app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

//  Archivos estáticos
app.use('/upload', express.static('upload'))
app.use(express.static('public'))

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
    console.log(`Servidor OK en puerto ${PORT}`)
})