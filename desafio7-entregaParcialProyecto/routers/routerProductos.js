const express = require('express')
const routerProductos = express.Router()
const upload = require('../multer')

const {
    getProductos,
    getProductoById,
    modificarProductoById,
    crearProducto,
    borrarProductoById
} = require('../controllers/controllersProductos.js')

//  Middleware - Acceso solo para Administradores   
const esAdmin  = true

const enviarErrorAuth = (url, metodo)  =>{
    const error ={
        error: -1
    }
    if(url && metodo){
        error.descripcion = `No tiene las credenciales para acceder a la ruta ${url} con el método ${metodo}`
    }
    else{
        error.descripcion = "No autorizado"
    }
    return error
}

const soloAdmins = (req, res, next) =>{
    if (!esAdmin){
        res.json((enviarErrorAuth(req.url, req.method)))
    }
    else{
        next()
    }
}

// Rutas
routerProductos.get('', getProductos)
routerProductos.get('/:id', getProductoById)
routerProductos.post('', soloAdmins, upload.single('file'), crearProducto)
routerProductos.put('/:id', soloAdmins, modificarProductoById)
routerProductos.delete('/:id', soloAdmins, borrarProductoById)

module.exports = routerProductos