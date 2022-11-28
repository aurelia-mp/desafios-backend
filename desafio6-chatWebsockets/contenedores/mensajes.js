const fs = require('fs')

class ContenedorMensajes {
    constructor(ruta) {
        this.ruta = ruta
    }

    listar(id) {
        let historial = fs.readFileSync(this.ruta, 'utf-8')
        let mensajesFiltrados = historial.filter((el) => el.id === id)
        return mensajesFiltrados
    }

    listarAll() {
        let historial = fs.readFileSync(this.ruta, 'utf-8')
        return historial
    }

    guardar(elem) {
        let historial = JSON.parse(fs.readFileSync(this.ruta, 'utf-8'))
        let id
        if (historial.length === 0){
            id = 1
        }
        else{
            let i = historial.length
            id = historial[i-1].id + 1
        }

        elem = {
            ...elem,
            id: id
        }
        historial.push(elem)
        fs.writeFileSync(this.ruta, JSON.stringify(historial, null, 2))
        return false
    }

    actualizar(elem, id) {
        let historial = JSON.parse(fs.readFileSync(this.ruta, 'utf-8'))
        let indexACambiar = historial.findIndex((mje) => mje.id === id)
        if (indexACambiar===-1){
            return null
        }
        
        let mensajeACambiar = {
            ...historial[indexACambiar],
            ...elem
        }
        historial[indexACambiar] = mensajeACambiar
        fs.writeFileSync(this.ruta, JSON.stringify(historial, null, 2))
        return 
    }

    borrar(id) {
        let historial = JSON.parse(fs.readFileSync(this.ruta, 'utf-8')) 
        let indexABorrar = historial.find((mje) => mje.id === id)
        historial.splice(indexABorrar, 1)
        fs.writeFileSync(this.ruta, JSON.stringify(historial, null, 2))
        return null
    }

    borrarAll() {
        fs.writeFileSync(this.ruta, JSON.stringify([], null, 2))
        return
    }
}

module.exports = ContenedorMensajes
