import knex from 'knex'
import config from '../config.js'

const mariaDbClient = knex(config.mariaDb)
const sqliteClient = knex(config.sqlite3)

//------------------------------------------
// productos en MariaDb

try {
    // Borrar tabla si ya existe
    await mariaDbClient.schema.dropTableIfExists('productos')

    // Crear tabla
    await mariaDbClient.schema.createTable('productos', table =>{
        table.increments('id').primary()
        table.string('title')
        table.integer('price')
        table.string('thumbnail')
    })

    console.log('tabla productos en mariaDb creada con éxito')

    // Insertar registros
    let prods = [
        {
          "title": "Luigi Bosca Malbec",
          "price": 3400,
          "thumbnail": "/upload/item1.jpeg",
          "id": 1
        },
        {
          "title": "Luigi Bosca Sauvignon Blanc",
          "price": 3000,
          "thumbnail": "/upload/item2.jpeg",
          "id": 2
        },
        {
          "title": "Amalaya Torrontés",
          "price": "3000",
          "thumbnail": "/upload/item7.jpeg",
          "id": 3
        },
        {
          "title": "Luigi Bosca Cabernet Sauvignon",
          "price": "4500",
          "thumbnail": "/upload/item4.jpeg",
          "id": 4
        },
        {
          "title": "Navarro Correas Espumante",
          "price": "4000",
          "thumbnail": "/upload/item3.jpeg",
          "id": 5
        },
        {
          "title": "Alma Negra Espumante",
          "price": "4600",
          "thumbnail": "/upload/item6.jpeg",
          "id": 6
        }
      ]
    await mariaDbClient('productos').insert(prods)
    
    const prodsDB = await mariaDbClient.from('productos').select('*')
    console.log(prodsDB)


} catch (error) {
    console.log('error al crear tabla productos en mariaDb')
    console.log(error)
} finally {
    mariaDbClient.destroy()
}

//------------------------------------------
// mensajes en SQLite3
try {
    // Borrar tabla si ya existe
    await sqliteClient.schema.dropTableIfExists('mensajes')

    // Crear tabla
    await sqliteClient.schema.createTable('mensajes', table =>{
        table.increments('id').primary()
        table.string('email')
        table.string('mensaje')
        table.string('fecha')
    })
    console.log('tabla mensajes en sqlite3 creada con éxito')

    // Insertar los primeros mensajes en la tabla
    let mensajes = [
        {
          "email": "a@a.com",
          "mensaje": "Primer Mensaje",
          "fecha": "26/11/2022 12:46:53",
          "id": 1
        },
        {
          "email": "a@a.com",
          "mensaje": "Hola!! ",
          "fecha": "26/11/2022 12:47:00",
          "id": 2
        },
        {
          "email": "a@a.com",
          "mensaje": "Cómo están?",
          "fecha": "28/11/2022 08:31:53",
          "id": 3
        },
        {
          "email": "usuario2@gmail.com",
          "mensaje": "Hola! Buen día!",
          "fecha": "28/11/2022 09:58:39",
          "id": 4
        }
      ]
      
      await sqliteClient('mensajes').insert(mensajes)
      const msj = await sqliteClient.from('mensajes').select('*')
      console.log(msj)
} catch (error) {
    console.log('error al crear tabla mensajes en sqlite3')
} finally {
    sqliteClient.destroy()
}