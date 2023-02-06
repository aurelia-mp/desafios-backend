import express from 'express'
import { Server as httpServer } from 'http'
import { Server as ioServer } from 'socket.io'
import ContenedorSQL from "./contenedores/contenedorSQL.js"
import ContenedorArchivo from './contenedores/contenedorArchivo.js'
import config from './config.js'
import path from 'path';
import { fileURLToPath } from 'url';
import { normalize, schema } from 'normalizr'
import { inspect } from 'util'


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
const mensajes = new ContenedorArchivo(`${config.fileSystem.path}/mensajes2.json`)

// Normalizacion de datos

// definimos esquemas
const author = new schema.Entity('authors', {}, {idAttribute:"email"})
const mensaje = new schema.Entity('text',{
    author: author
})
const schemaMensajes = new schema.Entity('posts',{
    mensajes: [mensaje]
})

function print(objeto){
    console.log(inspect(objeto, false, 12, true))
}

const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, schemaMensajes)


// Implementación de websocket
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

async function listarMensajesNormalizados() {
    const archivoMensajes = await mensajes.getAll()
    const normalizados = normalizarMensajes(archivoMensajes)
    console.log("desde l 102")
    print(normalizados)
    console.log('XXXXXXXXXXXXXXXXXXXX')
    return normalizados
}

// FAKER

import faker from 'faker'
faker.locale = 'es'

function creaCombinacionesRandom() {
    return {
        nombre: faker.commerce.productName(),
        price: faker.commerce.price(),
        url: faker.system.filePath()
    }
}

app.get('/api/productos-test', (req, res) => {
    const objs = [];

    for (let i = 0; i < 10; i++){
        objs.push(creaCombinacionesRandom())
    }
    res.json(objs)

})

// Inicio el servidor
const PORT = 8080
const connectedServer = httpserver.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
