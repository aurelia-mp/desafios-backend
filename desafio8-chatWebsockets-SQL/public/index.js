const socket = io.connect()

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

const inputEmail = document.getElementById('inputEmail')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    //Armar el objeto de mensaje y luego emitir mensaje al evento nuevoMensaje con sockets
    const mensaje= {
        "email":inputEmail.value,
        "mensaje":inputMensaje.value
    }
    socket.emit('nuevoMensaje', mensaje)
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('mensajes', mensajes => {
    const html = makeHtmlList(mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

function makeHtmlList(mensajes) {
    //Armar nuestro html para mostrar los mensajes como lo hicimos en clase
    let html = mensajes.map((mje) =>{
        return (`
        <p>
        <strong class="email">${mje.email}</strong> [<span class="fecha">${mje.fecha}</span>]: <em class="mensaje">${mje.mensaje}</em>
        </p>`)
    }).join('')
    return html
}

inputEmail.addEventListener('input', () => {
    const hayEmail = inputEmail.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})
