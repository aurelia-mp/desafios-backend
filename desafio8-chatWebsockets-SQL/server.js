import express from 'express'
import { Server as httpServer } from 'http'
import { Server as ioServer } from 'socket.io'
import ContenedorSQL from "./contenedores/contenedorSQL.js"
import config from './config.js'
import path from 'path';
import { fileURLToPath } from 'url';

const app = express()
const httpserver = new httpServer(app)
const io = new ioServer(httpserver)

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/upload', express.static(__dirname + '/upload'))
app.use('/', express.static(__dirname + '/public'))

const productos = new ContenedorSQL(config.mariaDb, 'productos')
const mensajes = new ContenedorSQL(config.sqlite3, 'mensajes')

// Implementación de websocket
io.on('connection', socket =>{
    console.log('usuario conectado')
    // Al conectarse un nuevo usuario, aparece el historial de mensajes anteriores
    mensajes.getAll()
    .then((mjes) =>{
        socket.emit('mensajes', mjes)
        console.log(mjes)
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
            "fecha": fecha
        }
        mensajes.save(mensaje)
        .then(() => {
            mensajes.getAll()
            .then((lista =>{
                io.sockets.emit('mensajes', lista)
            }))
        })
    })
})

// Inicio el servidor
const PORT = 8081
const connectedServer = httpserver.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
