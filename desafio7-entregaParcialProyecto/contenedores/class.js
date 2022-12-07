const fs = require('fs').promises

class Contenedor {
    constructor(path){
        this.path = path
    }

    async save(objeto){
        try{
            const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
            let id = 1
            dataFormateada.length != 0 && (id=dataFormateada[dataFormateada.length-1].id + 1)
            dataFormateada.push(
                {...objeto,
                id: id
                })
            await fs.writeFile(this.path, JSON.stringify(dataFormateada, null, 2))
            return id
        }
        catch(err){
            console.log(err)
        }
    }

    async getById(number){
        try{
            const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const elementoFiltrado = dataFormateada.filter((elem) => elem.id===number)
            // return (elementoFiltrado.length !== 0) ? JSON.stringify(elementoFiltrado, null, 2) 
            //         : null
            return (elementoFiltrado.length !== 0) ? elementoFiltrado 
                    : null
        }
        catch(err){console.log(err)}
    }

    async getIndexById(number){
        try{
            const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const index = dataFormateada.findIndex((elem) => elem.id===number)
            if (index != -1) return index
            else return null
        }
        catch(err){console.log(err)}
    }

    async udpateById(id, cambios){
        try{
            const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const index = dataFormateada.findIndex((elem) => elem.id===id)     
            
            console.log(index)

            if(index===-1){
                return null
            }

            let elementoActualizado = {
                ...dataFormateada[index],   
                ...cambios
            }

            dataFormateada[index] = elementoActualizado
            await fs.writeFile(this.path, JSON.stringify(dataFormateada, null, 2))
            return          
        }
        catch(err){console.log(err)}
    }

    async getAll(){
        try{
            const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
            return dataFormateada
        }
        catch(error){
            console.log("error de lectura")
        }

    }
    
    async deleteById(number){
        try{
            let dataFormateada = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const indexABorrar = dataFormateada.findIndex((elem) => elem.id === number)
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
            console.log('Error al borrar')
        }
    }
}

module.exports=Contenedor