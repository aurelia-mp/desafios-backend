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

module.exports = upload