import express from "express";
import routerProductos from "./routers/routerProductos.js";
import routerCarrito from "./routers/routerCarrito.js";
import handlebars from 'express-handlebars'

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

const PORT = process.env.PORT || 8080

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Routers
app.use('/api/productos', routerProductos)
app.use('/api/carritos', routerCarrito)

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

app.get('*', ((req, res) => {
    res.send({ status: "error: -2", description: `ruta ${req.url} método ${req.method} no implementada` });
}))

const server = app.listen(PORT, () =>{
    console.log(`Servidor OK en puerto ${PORT}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))