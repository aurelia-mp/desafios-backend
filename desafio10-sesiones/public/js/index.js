const socket = io.connect()

const formLogin = document.getElementById('formLogin')
    
const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    //Armar objeto producto y emitir mensaje a evento update
    let nombre = document.getElementById('nombre').value
    let precio = document.getElementById('precio').value
    let foto = document.getElementById('foto').value 

    let nuevoProducto = {
        title: nombre,
        price: precio,
        thumbnail: foto
    }
    socket.emit('nuevoProducto', nuevoProducto)
})

function makeHtmlTable(productos) {
    return fetch('./plantillas/tablaProductos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos: productos })
            return html
        })
}


socket.on('productos', productos => {
    //generar el html y colocarlo en el tag productos llamando a la funcion makeHtmlTable
    let divProductos = document.getElementById('productos')
    makeHtmlTable(productos)
    .then((html)=>{
        divProductos.innerHTML = html
    })
});

//-------------------------------------------------------------------------------------

/* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */

const author = new normalizr.schema.Entity('authors', {}, {idAttribute:"email"})
const mensaje = new normalizr.schema.Entity('text',{
    author: author
})
const schemaMensajes = new normalizr.schema.Entity('posts',{
    mensajes: [mensaje]
})

/* ----------------------------------------------------------------------------- */

const inputUsername = document.getElementById('username')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    //Armar el objeto de mensaje y luego emitir mensaje al evento nuevoMensaje con sockets
    const mensaje = {
        author: {
            email: inputUsername.value,
            nombre: document.getElementById('firstname').value,
            apellido: document.getElementById('lastname').value,
            edad: document.getElementById('age').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: inputMensaje.value
    }
    socket.emit('nuevoMensaje', mensaje)
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('mensajes', mensajesN => {
    let mensajesNsize = JSON.stringify(mensajesN).length
    console.log(mensajesN, mensajesNsize);

    let mensajesD = normalizr.denormalize(mensajesN.result, schemaMensajes, mensajesN.entities)
    let mensajesDsize = JSON.stringify(mensajesD).length
    console.log(mensajesD, mensajesDsize);

    let porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize)
    console.log(`Porcentaje de compresión ${porcentajeC}%`)
    document.getElementById('compresion-info').innerText = porcentajeC


    const html = makeHtmlList(mensajesD)
    document.getElementById('mensajes').innerHTML = html;
})

function makeHtmlList(mensajes) {
    //Armar nuestro html para mostrar los mensajes como lo hicimos en clase
    let html = mensajes.mensajes.map((mensaje) =>{
        return (`
        <div>
            <b style="color:blue;">${mensaje.author.email}</b>
            [<span style="color:brown;">${mensaje.fyh}</span>] :
            <i style="color:green;">${mensaje.text}</i>
            <img width="50" src="${mensaje.author.avatar}" alt=" ">
        </div>
    `)
    }).join('')
    return html
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})

