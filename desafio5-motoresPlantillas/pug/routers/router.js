const express = require('express')
const router = express.Router()
const upload = require('../multer')

const {
    getProductos,
    getProductoById,
    modificarProductoById,
    crearProducto,
    borrarProductoById
} = require('../controllers/controllers.js')

// router.use(express.json())
// router.use(express.urlencoded({extended: true}))

router.get('', getProductos)
router.get('/:id', getProductoById)
router.post('', upload.single('file'), crearProducto)
router.put('/:id', modificarProductoById)
router.delete('', borrarProductoById)

module.exports = router