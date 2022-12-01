const express = require("express");
const router =require('./routers/routerProductos.js')
// const handlebars = require('express-handlebars')

const PORT = process.env.PORT || 8080

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/productos', router)

app.use('/', express.static(__dirname + '/public'))
app.use('/upload', express.static(__dirname + '/upload'))

// Configuración Handlebars
// app.engine('hbs', 
//     handlebars({
//         extname: '.hbs',
//         defaultLayout: 'index.hbs',
//         layoutsDir:__dirname+'/views/layouts',
//         partialsDir: __dirname+'/views/partials'
//     }))

// app.set('views', './views')
// app.set('view engine', 'hbs')

// Ruta raíz
app.get('', (req, res)=>{
    res.render('')
})

app.listen(PORT, () =>{
    console.log('Servidor OK')
})