import express from 'express'
import session from 'express-session'
import ContenedorSQL from "./contenedores/contenedorSQL.js"
import ContenedorArchivo from './contenedores/contenedorArchivo.js'
import mongoose from "mongoose";
import cluster from 'cluster'
import os from 'os'

import config from './config.js'

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Server as httpServer } from 'http'
import { Server as ioServer } from 'socket.io'

import { logInfo, logWarn } from './loggers/loggers.js'

const app = express()
const httpserver = new httpServer(app)
const io = new ioServer(httpserver)

import compression from 'compression'

app.use(compression())

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
mongoose.set('strictQuery', true)
await mongoose.connect(URL, advancedOptions)

import routerAuth from './routers/routerPassport.js'
import routerApi from './routers/routerApi.js'

//Loggeo de todas las peticiones

app.use((req, res, next) =>{
    logInfo(`${req.method} ${req.url}`)
    next()
})

// Rutas
app.use('', routerAuth)
app.use(routerApi)

// Loggeo de rutas inexistentes

app.use('*', (req, res, next) => {
    logWarn(`ruta ${req.originalUrl} método ${req.method} no implementada`)
    next()
})

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
                .catch((err)=>{
                    logError(err.message)
                })
            }))
        })
    })
});

// CLUSTER
export const CPU_CORES = os.cpus().length
if (config.mode == 'CLUSTER' && cluster.isPrimary) {
    console.log('Cantidad de cores: ', CPU_CORES)
    
    for (let i = 0; i < CPU_CORES; i++) {
        cluster.fork()
    }
    
    cluster.on('exit', worker => {
        console.log(`Worker finalizó proceso ${process.pid} ${worker.id} ${worker.pid} finalizó el ${new Date().toLocaleString}`)
        cluster.fork()
    })
} else {
    httpserver.listen(config.PORT, err => {
        if (!err) console.log(`Servidor http escuchando en el puerto ${config.PORT} - PID: ${process.pid}`)
    })
}
