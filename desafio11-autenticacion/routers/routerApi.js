import express from 'express'
import { fork } from 'child_process'
import path from 'path'
import { logError } from '../loggers/loggers.js'
import { nextTick } from 'process'
const routerApi = express.Router()

// RUTA RANDOM
function calcular(cantidad) {
    return new Promise((res, rej) => {
        const forked = fork(path.resolve(process.cwd(), 'scripts/calcularRandoms.js' ))

        forked.on('message', mensaje => {
            if (mensaje == 'ready') {
                forked.send(cantidad)
            } else {
                res(mensaje)
            }
        })
    })
}

routerApi.get('/api/randoms', async (req, res, next) => {
    const { cant = 100_000_000 } = req.query
    try{
        const result = await calcular(cant)
        res.json(result)
    }
    catch (error){
        logError(error.message)
        next(error)
    }
   
})

export default routerApi