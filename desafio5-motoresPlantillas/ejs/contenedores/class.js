const fs = require('fs').promises

class Contenedor {
    constructor(path){
        this.path = path
    }

    async save(objeto){
        try{
            const leer = await fs.readFile(this.path, 'utf-8')
            const dataFormateada = JSON.parse(leer)
            let id = 1
            dataFormateada.length != 0 && (id=dataFormateada[dataFormateada.length-1].id + 1)
            dataFormateada.push({...objeto, id: id})
            await fs.writeFile(this.path, JSON.stringify(dataFormateada, null, 2))
            return id
        }
        catch(err){
            console.log(err)
        }
    }

    async getById(number){
        try{
            const leer = await fs.readFile(this.path, 'utf-8')
            const dataFormateada = JSON.parse(leer)
            const productoFiltrado = dataFormateada.filter((prod) => prod.id===number)
            return (productoFiltrado.length !== 0) ? JSON.stringify(productoFiltrado, null, 2) 
                    : null
        }
        catch(err){console.log(err)}
    }

    async getIndexById(number){
        try{
            const leer = await fs.readFile(this.path, 'utf-8')
            const dataFormateada = JSON.parse(leer)
            const index = dataFormateada.findIndex((prod) => prod.id===number)
            if (index != -1) return index
            else return null
        }
        catch(err){console.log(err)}
    }

    async udpateById(id, cambios){
        try{
            const leer = await fs.readFile(this.path, 'utf-8')
            const dataFormateada = JSON.parse(leer)
            const index = dataFormateada.findIndex((prod) => prod.id===id)       
            if(index===-1){
                return null
            }

            let productoAActualizar = {
                ...dataFormateada[index],   
                ...cambios
            }

            dataFormateada[index] = productoAActualizar
            await fs.writeFile(this.path, JSON.stringify(dataFormateada, null, 2))
            return            
            
        }
        catch(err){console.log(err)}
    }

    async getAll(){
        try{
            const leer = await fs.readFile(this.path, 'utf-8')
            return leer
        }
        catch(error){
            console.log("error al leer los productos")
        }

    }
    
    async deleteById(number){
        try{
            const leer = await fs.readFile(this.path, 'utf-8')
            let dataFormateada = JSON.parse(leer)
            const indexABorrar = dataFormateada.findIndex((prod) => prod.id === number)
            if (indexABorrar === -1){
                return null
            }

            dataFormateada.splice(indexABorrar,1)
            await fs.writeFile(this.path, JSON.stringify(dataFormateada, null, 2))
            return dataFormateada
        }
        catch(err){console.log(err)}
    }

    async deleteAll(){
        try{
            await fs.writeFile(this.path, JSON.stringify([], null, 'utf-8'), null)
            return
        }
        catch(error){
            console.log('Error al borrar los productos')
        }
    }
}

module.exports=Contenedor