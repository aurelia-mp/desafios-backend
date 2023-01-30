import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import ContenedorSQL from "./contenedores/contenedorSQL.js"
import ContenedorArchivo from './contenedores/contenedorArchivo.js'
import mongoose from "mongoose";
import * as model from './models/users.js'


import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;

import bcrypt from 'bcrypt'

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

// Passport local
passport.use(new LocalStrategy(
    async function(username, password, done){
        console.log(`El usuario enviado desde l 45 es ${username} ${password}`)
        // Existe usuario devuelve el objeto del usuario (con ObjectId de Mongo)
        const existeUsuario = await model.usuarios.find({username: username})
        console.log('Existe usuario: ' + existeUsuario)

        if(!existeUsuario){
            console.log('usuario no encontrado')
            return done(null, false)
        }
        else{
            const match = await verifyPass(existeUsuario, password)
            if (!match) {
                return done(null, false)
            }
            return done(null, existeUsuario);
        }
    }
))

passport.serializeUser((usuario, done) => {
    done(null, usuario);
});

passport.deserializeUser((nombre, done) => {
    model.usuarios.find({username: nombre})
    .then((res=>{
        done(null, res)
    }))
    .catch((err) =>{console.log('error desde deserializacion' + err)})
    // const existeUsuario = usuariosDB.find(usuario => usuario.nombre == nombre);
    // done(null, existeUsuario);
});



// Session
app.use(session({
    store: MongoStore.create({
        // local
        mongoUrl: `${config.mongoLocal.mongoUrl}`,
        mongoOptions: advancedOptions,
        ttl:60,
        collectionName: 'sessions'
        // mongoUrl: "mongodb://localhost/sesiones"
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000
    }
}))

app.use(passport.initialize())
app.use(passport.session());

// Metodos de Auth con Bcrypt
async function generateHashPassword(password) {
    const hashPassword = await bcrypt.hash(password, 10)
    return hashPassword
}

async function verifyPass(usuario, password) {
    const match = await bcrypt.compare(password, usuario[0].password)
    console.log(`pass login: ${password} || pass hash: ${usuario[0].password}`)
    console.log(match)
    return match
}

/*----------- Motor de plantillas -----------*/

app.set('views', './views/pages')
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function isAuth(req,res,next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.redirect('/login')
    }
}

// Mongo DB
const URL = 'mongodb://localhost:27017/usuarios'
await mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// app.get('/', (req, res) => {
//     if(req.session.nombre){
//         res.render('home', {nombre: req.session.nombre})
//     }
//     else{
//         res.redirect('/login')
//     }
// })

app.get('/', isAuth, (req,res) =>{
    const nombre = req.session.passport.user[0].username
    const email = req.session.passport.user[0].email
    res.render('home',  {nombre: nombre, email: email })
})

app.get('/logout', (req, res) => {
    res.render('logout', {nombre: req.session.passport.user[0].username})
    req.session.destroy(err=>{
        if(err){
            res.json({status: 'Error al desloggearse', body: err})
        }
    })
    
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/login-error', (req, res) => {
    res.render('login-error');
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register', async (req,res) =>{
    let{ username, email, password } = req.body
    console.log(username, email, password)
    const newUser = {
        username: username,
        email: email,
        password: await generateHashPassword(password)
    }
    
    saveUser(newUser)
    .then((res)=>{
        console.log(res)
    })
    
    // req.session.nombre = nombre
    res.redirect('/login');
})

app.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect: '/login-error'}))



async function saveUser(user){
    const userSave = await model.usuarios.insertMany(user)
    return userSave
}

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
