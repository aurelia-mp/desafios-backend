import { promises as fs } from 'fs'

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = ruta;
    }

    async getById(id) {
        try{
            const data = await fs.readFile(this.ruta, 'utf-8')
            const dataFormateada = JSON.parse(data)
            const registroFiltrado = dataFormateada.filter((elem) => elem.id===id)
            return (registroFiltrado.length !== 0) ? 
                JSON.stringify(registroFiltrado, null, 2) 
                : 
                null
        }
        catch(err){console.log('Error al obtener el registros', err)}
    }

    async getAll() {
        try{
            let data = await fs.readFile(this.ruta, 'utf-8')
            let dataFormateada = JSON.parse(data)
            return dataFormateada
        }
        catch(error){
            console.log('Error de lectura', error)
            
        }
    }

    async save(elem) {
        try{
            let data = await fs.readFile(this.ruta, 'utf-8')
            let dataFormateada = JSON.parse(data)
            let id = 1

            // CASO MENSAJES
            if (dataFormateada.id === "mensajes"){
                console.log('Leyendo mensajes')
                let contenido = dataFormateada.mensajes
                contenido.length != 0 && (id=contenido[contenido.length-1].id + 1)
                contenido.push({...elem, id:id})
                await fs.writeFile(this.ruta, JSON.stringify(dataFormateada, null, 2))
                return id
            }

            // CASO PRODUCTOS
            else{
                dataFormateada.length != 0 && (id=dataFormateada[dataFormateada.length-1].id + 1)
                dataFormateada.push({...elem, id: id})
                await fs.writeFile(this.ruta, JSON.stringify(dataFormateada, null, 2))
                return id
            }
            
        }
        catch (error){
            console.log('Error al guardar', error)
        }
        
    }


    async updateById(id, cambios) {
        try{
            let data = await fs.readFile(this.ruta, 'utf-8')
            const dataFormateada = JSON.parse(data)
            const index = dataFormateada.findIndex((elem) => elem.id===id)       
                if(index===-1){
                    return null
                }
    
                let elementoAActualizar = {
                    ...dataFormateada[index],   
                    ...cambios
                }
    
                dataFormateada[index] = elementoAActualizar
                await fs.writeFile(this.ruta, JSON.stringify(dataFormateada, null, 2))
                return   
        }
        catch(error){
            console.log('Error al actualizar', error)
        }
            
    }

    async deleteById(id) {
        try{
            const data = await fs.readFile(this.ruta, 'utf-8')
            const dataFormateada = JSON.parse(data)
            const elementosFiltrados = dataFormateada.filter((elem) => elem.id !== id)
            if (elementosFiltrados.length === dataFormateada.length) {
                return null
            } 
            await fs.writeFile(this.ruta, JSON.stringify(elementosFiltrados, null, 2))
            return
        }
        catch(error){
            console.log('Error al borrar el registro', error)
        }
    }

    async deleteAll() {
        try{
            await fs.writeFile(this.ruta, JSON.stringify([], null, 'utf-8'), null)
            return
        }
        catch(error){
            console.log('Error al borrar los productos')
        }
    }
}

export default ContenedorArchivo