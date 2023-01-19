import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import ContenedorSQL from "./contenedores/contenedorSQL.js"
import ContenedorArchivo from './contenedores/contenedorArchivo.js'

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


app.set('views', './views/pages')
app.set('view engine', 'ejs');

const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopologu: true
}

// Session
app.use(session({
    store: MongoStore.create({
        // local
        mongoUrl: `${config.mongoLocal.mongoUrl}`
        // mongoUrl: "mongodb://localhost/sesiones"
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000
    }
}))

app.get('/', (req, res) => {
    if(req.session.nombre){
        res.render('home', {nombre: req.session.nombre})
    }
    else{
        res.redirect('/login')
    }
})

app.get('/logout', (req, res) => {
    res.render('logout', {nombre: req.session.nombre})
    req.session.destroy(err=>{
        if(err){
            res.json({status: 'Error al desloggearse', body: err})
        }
    })
    
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req,res) =>{
    let nombre = req.body.nombre;
    req.session.nombre = nombre
    res.redirect('/');
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
            }))
        })
    })
});


httpserver.listen(config.PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${config.PORT}`)
})
