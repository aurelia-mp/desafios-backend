import express from 'express'
import session from 'express-session'
import ContenedorSQL from "./contenedores/contenedorSQL.js"
import ContenedorArchivo from './contenedores/contenedorArchivo.js'
import mongoose from "mongoose";

import config from './config.js'

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Server as httpServer } from 'http'
import { Server as ioServer } from 'socket.io'

const app = express()
const httpserver = new httpServer(app)
const io = new ioServer(httpserver)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

const productos = new ContenedorSQL(config.mariaDb, 'productos')
const mensajes = new ContenedorArchivo(`${config.fileSystem.path}/mensajes2.json`)

const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// Session
app.use(session(config.session))


/*----------- Motor de plantillas -----------*/

app.set('views', './views/pages')
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mongo DB
const URL = 'mongodb://localhost:27017/usuarios'
await mongoose.connect(URL, advancedOptions)

import router from './passport.js'
app.use('', router)


// Normalizacion de datos
import { listarMensajesNormalizados } from './normalize.js'

io.on('connection', socket =>{
    console.log('usuario conectado')

    // Al conectarse un nuevo usuario, aparece el historial de mensajes anteriores
    listarMensajesNormalizados()
    .then((mensajesN)=>{
        socket.emit('mensajes', mensajesN)
    })        
    
    // Recibo un producto nuevo
    socket.on('nuevoProducto', nuevoProducto =>{
        productos.save(nuevoProducto)
        .then((res) => {
            productos.getAll()
            .then((productos) =>{
                socket.emit('productos', productos)
            })
        })
    })
    
    // Recibo un mensaje nuevo
    socket.on('nuevoMensaje', mje =>{
        let fecha = new Date().toLocaleString()
        let mensaje = {
            ...mje,
            "fyh": fecha
        }
        console.log(mensaje)
        mensajes.save(mensaje)
        .then(() => {
            mensajes.getAll()
            .then((lista =>{
                // io.sockets.emit('mensajes', lista)
                listarMensajesNormalizados()
                .then((res)=>{
                    io.sockets.emit('mensajes',res)
                })
            }))
        })
    })
});


httpserver.listen(config.PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${config.PORT}`)
})
