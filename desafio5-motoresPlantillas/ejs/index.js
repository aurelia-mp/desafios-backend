const express = require("express");
const router =require('./routers/router.js')

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/productos', router)

app.use('/upload', express.static('upload'))

// Configuración EJS
app.set('views', './views')
app.set('view engine', 'ejs')

// Ruta raíz
app.get('', (req, res)=>{
    res.render('pages/index')
})

app.listen(PORT, () =>{
    console.log('Servidor OK')
})