import express from 'express'
import { fork } from 'child_process'
import path from 'path'
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

routerApi.get('/api/randoms', async (req, res) => {
    const { cant = 100_000_000 } = req.query
    const result = await calcular(cant)
    res.json(result)
})

export default routerApi