const Contenedor = require('../contenedores/class')
const productos = new Contenedor('./db/productos.json')

const getProductos = (req,res) =>{
    productos.getAll()
    .then(productos=>{
        res.render('products', {productos: productos})
    })
    .catch(err=>{
        res.send(err)
    })
}

const getProductoById = (req,res) =>{
        let id = parseInt(req.params.id)
        productos.getById(id)
        .then(resp => 
            resp ? 
                res.send(resp)
                :
                res.send({error: 'producto no encontrado'}) 
            )
}

const borrarProductoById = (req,res) =>{
    let id=parseInt(req.params.id)
    productos.deleteById(id)
    .then(resp=>
            resp ?
                (res.send(`Producto ${id} borrado`))
                :
                res.send({error: 'producto no encontrado'}) 
        )
}

const modificarProductoById = (req,res) =>{
    let id = parseInt(req.params.id)
    let timestamp= Date.now()

    let cambios = req.body
    productos.udpateById(id, cambios)

    .then(resp=>{
        res.send(`Producto ${id} actualizado`)
    })
}

const crearProducto = (req,res,next) =>{
    const file = req.file

    if(!file) {
        const error = new Error('Error subiendo el archivo')
        error.httpStatusCode = 400
        return next(error)
    }
    
    const timestamp = Date.now()

    let producto = {
        ...req.body,
        thumbnail: `/upload/${file.originalname}`,
        timestamp: timestamp
    }

    if(!req.body.nombre || !req.body.precio) {
        const error = new Error('Faltan campos obligarios')
        error.httpStatusCode = 400
        return next(error)
    }
    productos.save(producto)

    .then(resp =>{
        console.log('Producto guardado')
        productos.getAll()
        .then((listaProductos) =>{
            res.render('main', {listaProductos})
        })
    })
}

module.exports = {
    getProductos,
    getProductoById,
    modificarProductoById,
    crearProducto,
    borrarProductoById
} 