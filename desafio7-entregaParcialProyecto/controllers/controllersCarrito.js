const Contenedor = require('../contenedores/class')
const carritos = new Contenedor('./db/carritos.json')
const productos = new Contenedor('./db/productos.json')

const crearCarrito = (req,res) =>{
    // crear  un carrito vacío y devuelve  el id
    let timestamp = Date.now()
    let nuevoCarrito = {
        items: [],
        cart_timestamp: timestamp
    } 
    carritos.save(nuevoCarrito)
    .then(id => res.send(`Carrito creado con el id ${id}`))
}

const borrarCarrito = (req,res) =>{
    let id = parseInt(req.params.id)
    carritos.deleteById(id)
    .then(resp =>{
        res.send('Carrito eliminado')
    })
}
const getCarrito = (req,res) => {
    //  Lista los productos del carrito
    let id= parseInt(req.params.id)
    carritos.getById(id)
    .then((carrito) => {
        let prods = carrito[0]["items"]
        res.json({"Productos en el carrito:" : prods})
    })
}

const agregarItemAlCarrito  = (req,res)  =>{
    let id = parseInt(req.params.id)
    let id_prod =parseInt(req.params.id_prod)
    productos.getById(id_prod)
    .then((productoNuevo)=>{
        carritos.getById(id)
        .then((carritoAActualizar) =>{
            let prods= carritoAActualizar[0]["items"]
            prods.push(productoNuevo[0])
            let cart_timestamp = Date.now()
            carritos.udpateById(id, {"items": prods, cart_timestamp})
            res.send("Carrito actualizado")
        })
    })
}

const agregarVariosItemsAlCarrito  = (req, res) =>{
    // Carga un nuevo array de productos a un carrito
    let prods = req.body
    let id = parseInt(req.params.id)
    let cart_timestamp = Date.now()
    carritos.udpateById(id, {"items": prods, cart_timestamp})
    res.send("Productos agregados al carrito")
}

const borrarItemDelCarrito = (req,res) =>{
    let id = parseInt(req.params.id)
    let id_prod =parseInt(req.params.id_prod)
    carritos.getById(id)
    .then((carrito)=>{
        let prods= carrito[0]["items"]
        let index = prods.findIndex((el) => el.id === id_prod)
        if (index === -1){
            res.send(`Error: Este producto no se encuentra en el carrito`)
        }
        prods.splice(index,1)
        let cart_timestamp = Date.now()
        carritos.udpateById(id, {"items": prods, cart_timestamp})
        res.send("Producto eliminado")
    })
    .catch(err => {res.send(`Error: el carrito no existe - ${err}`)}) 
}

module.exports = {
    getCarrito,
    borrarCarrito,
    crearCarrito,
    agregarItemAlCarrito,
    agregarVariosItemsAlCarrito,
    borrarItemDelCarrito
}