import knex from 'knex'

class ContenedorSQL {
    constructor(config,tabla){
        this.knex = knex(config) 
        this.tabla=tabla
    }

    async getAll(){
        try{
            let knexConnection = this.knex
            const data = await knexConnection.from(this.tabla).select('*')
            return data
        }
        catch(error){
            console.log("error de lectura", error)
        }   
    }

    async save(objeto){
        try{
            let knexConnection=this.knex
            await knexConnection(this.tabla).insert(objeto)
            // TODO --- Buscar el ID del obj que inserté para retornearlo
            // let ultimoGuardado = await knexConnection(this.tabla).select('*').orderBy('id', 'desc').limit(1) 
            // console.log(ultimoGuardado)
            // return ultimoGuardado
            return
        }
        catch(err){
            console.log(err)
        }
    }

    async getById(number){
        try{
            let knexConnection=this.knex
            let objeto = await knexConnection(this.tabla).where('id', number)
            return objeto || null
        }
        catch (err){
            console.log(err)
        }
    }

    // SE USA?
    async getIndexById(number){
  
    }

    async udpateById(id, cambios){
        try{
            let knexConnection = this.knex
            await knexConnection(this.tabla).where('id', id).update({cambios})
            // TODO - VER COMO RETORNEAR OTRO VALOR SI NO EXISTE
            return null
        }
        catch(error){ 
            console.log("no se pudo actualizar el producto ", error)
        } 
    }

    async deleteById(number){
        try{
            let knexConnection = this.knex
            await knexConnection(this.tabla).where('id', number).del()
            return
        }
        catch(error) {
            console.log('no se pudo borrar el producto', error)
        }
    }

    async deleteAll(){
       
        try{
            let knexConnection = this.knex
            knexConnection(this.tabla).del()
        }
        catch(err){
            console.log('No se pudo borrar la base de datos', err)
        }
    }
}

export default ContenedorSQL