import { normalize, schema, denormalize } from 'normalizr'
import ContenedorArchivo from './contenedores/contenedorArchivo.js'
import config from './config.js'


// const blogpost = {
//     id:1,
//     "posts":[
//         {
//         id: "1",
//         title: "My blog post",
//         description: "Short blogpost description",
//         content: "Hello world",
//         author: {
//             id: "1",
//             name: "John Doe"
//         },
//         comments: [
//             {
//                 id: "1",
//                 author: "Rob",
//                 content: "Nice post!"
//             },
//             {
//                 id: "2",
//                 author: "Jane",
//                 content: "I totally agree with you!"
//             }
//         ]
//     },
//     {
//         id: "2",
//         title: "My second blog post",
//         description: "otra descripcion",
//         content: "Hello",
//         author: {
//             id: "1",
//             name: "John Doe"
//         },
//         comments: [
//             {
//                 id: "1",
//                 author: "Rob",
//                 content: "Another nice post!"
//             }
//         ]
//     }
//     ]
// }

const mensajes = {
    "id":1,
      "mensajes": [{
        "author": {
          "email": "mariano.aquino@gmail.com",
          "nombre": "Mariano",
          "apellido": "Aquino",
          "edad": "35",
          "alias": "papapa",
          "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTteK8zsq_xcB7Sev9b02WlB-feEBTI8oIPAg&usqp=CAU"
        },
        "text": "peobando 21:44",
        "fyh": "8/28/2021, 9:44:58 PM",
        "id": 1
      },
      {
        "author": {
          "email": "correodementira",
          "nombre": "luchachucha",
          "apellido": "vera",
          "edad": "27",
          "alias": "luchachas",
          "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTteK8zsq_xcB7Sev9b02WlB-feEBTI8oIPAg&usqp=CAU"
        },
        "text": "holiii como estas?",
        "fyh": "8/28/2021, 9:46:38 PM",
        "id": 2
      },
      {
        "author": {
          "email": "mariano.aquino@gmail.com",
          "nombre": "Mariano",
          "apellido": "Aquino",
          "edad": "35",
          "alias": "papapa",
          "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTteK8zsq_xcB7Sev9b02WlB-feEBTI8oIPAg&usqp=CAU"
        },
        "text": "re bieeen, funcionaa!!",
        "fyh": "8/28/2021, 9:47:07 PM",
        "id": 3
      },
      {
        "author": {
          "email": "correodementira",
          "nombre": "luchachucha",
          "apellido": "vera",
          "edad": "27",
          "alias": "luchachas",
          "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTteK8zsq_xcB7Sev9b02WlB-feEBTI8oIPAg&usqp=CAU"
        },
        "text": "iupiiiiii",
        "fyh": "8/28/2021, 9:47:14 PM",
        "id": 4
      }
    ]
  }

const mensajesJson = new ContenedorArchivo(`${config.fileSystem.path}/mensajes2.json`)
const archivoMensajes = await mensajesJson.getAll()

// definimos esquemas
const author = new schema.Entity('authors', {}, {idAttribute:"email"})
const mensaje = new schema.Entity('text',{
    author: author
})
const post = new schema.Entity('posts',{
    mensajes: [mensaje]
})
const postSchema = new schema.Entity('posts', {
    author: author
})

import { inspect } from 'util'
function print(objeto){
    console.log(inspect(objeto, false, 12, true))
}

const normalizedData =normalize(archivoMensajes,post)
print(normalizedData)


// //--------------------------------------------
// // NORMALIZACIÓN DE MENSAJES TODO

// // Definimos un esquema de autor
// const archivoMensajes = await mensajesNuevo.getAll()

// const author = new schema.Entity('authors', {}, {idAttribute:'email'})

// // // Definimos un esquema de mensaje
// const message = new schema.Entity("messages")

// // // Definimos un esquema de posts
// const posts = new schema.Entity('posts',{
//     author: author,
//     text: message
// })

// const normalizedData = normalize(archivoMensajes, posts)
// function print(objeto){
//     console.log(util.inspect(objeto, false, 12, true))
// }
// print(normalizedData)

// const prueba = new ContenedorArchivo('./DB/prueba.json')
// const mensajesPrueba = await prueba.getAll()

// const author = new schema.Entity('authors')
// const message = new schema.Entity('messages',{
//     author: author
// })
