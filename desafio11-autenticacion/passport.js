import express from 'express'
const router = express.Router()
import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;
import * as model from './models/users.js'
import bcrypt from 'bcrypt'

// FUNCIONES
function isAuth(req,res,next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.redirect('/login')
    }
}

async function saveUser(user){
    const userSave = await model.usuarios.insertMany(user)
    return userSave
}


// Passport local
passport.use('local', new LocalStrategy(
    async function(username, password, done){
        const existeUsuario = await model.usuarios.findOne({email: username})

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
});

// RUTAS
router.use(passport.initialize())
router.use(passport.session());

router.get('/', isAuth, (req,res) =>{
    const nombre = req.session.passport.user.username
    const email = req.session.passport.user.email
    res.render('home',  {nombre: nombre, email: email })
})

router.get('/logout', (req, res) => {
    res.render('logout', {nombre: req.session.passport.user.username})
    req.session.destroy(err=>{
        if(err){
            res.json({status: 'Error al desloggearse', body: err})
        }
    })
    
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/login-error', (req, res) => {
    res.render('login-error');
})

router.get('/register',(req,res)=>{
    res.render('register')
})

router.post('/register', async (req,res) =>{
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

router.post(
    '/login', 
    passport.authenticate('local', {
        successRedirect:'/', 
        failureRedirect: '/login-error'
    }),
    (req, res) => {
        res.cookie('userEmail', req.session.passport.user)
    }
)

// Metodos de Auth con Bcrypt
async function generateHashPassword(password) {
    const hashPassword = await bcrypt.hash(password, 10)
    return hashPassword
}

async function verifyPass(usuario, password) {
    const match = await bcrypt.compare(password, usuario.password)
    console.log(`pass login: ${password} || pass hash: ${usuario.password}`)
    console.log(match)
    return match
}

export default router