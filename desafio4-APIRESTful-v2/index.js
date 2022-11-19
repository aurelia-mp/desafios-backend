const express = require("express");
const router =require('./routers/router')

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/productos', router)

app.use(express.static('public'))


app.listen(PORT, () =>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})