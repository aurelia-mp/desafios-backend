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

const ContenedorMensajes = require('./contenedores/mensajes.js')
const mensajes = new ContenedorMensajes('./database/mensajes.json')

// console.log(mensajes.listarAll())
// let mje = {
//     email: "aurelia.monnier@gmail.com",
//     fecha: "01/01/2012",
//     mensaje: "hola"
// }

// mensajes.guardar(mje)

// Implementación de websocket
io.on('connection', socket =>{
    console.log('usuario conectado')
    // Recibo un producto nuevo
    socket.on('nuevoProducto', nuevoProducto =>{
        productos.save(nuevoProducto)
        .then((guardado) => {
            console.log('producto guardado')
            productos.getAll()
            .then((productos) =>{
                socket.emit('productos', productos)
            })
        })
    })
    
    // Recibo un mensaje nuevo
    socket.on('nuevoMensaje', mje =>{
        let fecha = new Date().toLocaleString()
        console.log(fecha)
        let mensaje = {
            ...mje,
            "fecha": fecha
        }
        mensajes.guardar(mensaje)
        let listaMensajes = mensajes.listarAll()
        io.sockets.emit('mensajes', listaMensajes)
    })
})

// Inicio el servidor
const PORT = 8080
const connectedServer = httpserver.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
