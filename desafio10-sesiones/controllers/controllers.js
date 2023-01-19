import Contenedor from '../contenedores/contenedorArchivo.js'
// FALTA ACTUALIZAR ESTA RUTA
const productos = new Contenedor('./productos.txt')

const getProductos = (req,res) =>{
    productos.getAll()
    .then(resp=>{
        let productos = JSON.parse(resp)
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
    
    let producto = {
        title: req.body.nombre,
        price: req.body.precio,
        thumbnail: `/upload/${file.originalname}`
    }

    if(!req.body.nombre || !req.body.precio) {
        const error = new Error('Faltan campos obligarios')
        error.httpStatusCode = 400
        return next(error)
    }
    productos.save(producto)

    .then(resp =>{
        console.log('Producto guardado')
        let id = resp
        console.log(id)
        productos.getById(resp)
        .then(resp =>{
            res.render('main', {productoGuardado : true, id: id})
        })
    })
}

export default {
    getProductos,
    getProductoById,
    modificarProductoById,
    crearProducto,
    borrarProductoById
} 