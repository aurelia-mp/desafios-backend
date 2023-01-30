import { normalize, schema } from 'normalizr'
import { inspect } from 'util'
import ContenedorArchivo from './contenedores/contenedorArchivo.js'
import config from './config.js'

const mensajes = new ContenedorArchivo(`${config.fileSystem.path}/mensajes2.json`)

function print(objeto){
  console.log(inspect(objeto, false, 12, true))
}

export async function listarMensajesNormalizados() {
  const archivoMensajes = await mensajes.getAll()
  const normalizados = normalizarMensajes(archivoMensajes)
  return normalizados
}

const author = new schema.Entity('authors', {}, {idAttribute:"email"})
const mensaje = new schema.Entity('text',{
    author: author
})
const schemaMensajes = new schema.Entity('posts',{
    mensajes: [mensaje]
})

export const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, schemaMensajes)
