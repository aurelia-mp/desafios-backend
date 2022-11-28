const express = require("express");
const { Server: httpServer } = require('http');
const { Server: ioServer } = require('socket.io')


const app = express()
const httpserver = new httpServer(app)
const io = new ioServer(httpserver)

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Archivos estáticos
app.use('/upload', express.static(__dirname + '/upload'))
app.use('/', express.static(__dirname + '/public'))

const Contenedor = require('./contenedores/class')
const productos = new Contenedor('./database/productos.txt')
const mensajes = new Contenedor('./database/mensajes.json')

// Implementación de websocket
io.on('connection', socket =>{
    // Al conectarse un nuevo usuario, aparece el historial de mensajes anteriores
    mensajes.getAll()
    .then((mjes) =>{
        socket.emit('mensajes', mjes)
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
        .then((res) => {
            mensajes.getAll()
            .then((lista =>{
                io.sockets.emit('mensajes', lista)
            }))
        })
    })
})

// Inicio el servidor
const PORT = 8080
const connectedServer = httpserver.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
