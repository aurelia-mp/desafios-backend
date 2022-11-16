const express = require('express')
const router = express.Router()
const multer = require('multer')

// Configuración de Multer
const storage=multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, './upload')
    },
    filename: (req, file, cb) =>{
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({storage: storage})

const {
    getProductos,
    getProductoById,
    modificarProductoById,
    crearProducto,
    borrarProductoById
} = require('./controllers/controllers.js')

router.use(express.json())
router.use(express.urlencoded({extended: true}))

router.get('', getProductos)
router.get('/:id', getProductoById)
router.post('', upload.single('file'), crearProducto)
router.put('/:id', modificarProductoById)
router.delete('', borrarProductoById)

module.exports = router