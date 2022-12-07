const express = require('express')
const routerCarrito = express.Router()

const { 
    getCarrito,
    borrarCarrito,
    crearCarrito,
    agregarItemAlCarrito,
    agregarVariosItemsAlCarrito,
    borrarItemDelCarrito
} = require('../controllers/controllersCarrito')

routerCarrito.post('', crearCarrito)
routerCarrito.delete('/:id', borrarCarrito)
routerCarrito.get('/:id/productos', getCarrito)
routerCarrito.post('/:id/productos/:id_prod', agregarItemAlCarrito)
routerCarrito.post('/:id/productos/', agregarVariosItemsAlCarrito)
routerCarrito.delete('/:id/productos/:id_prod', borrarItemDelCarrito)

module.exports =routerCarrito
