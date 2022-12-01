// const socket = io.connect()
// const formAgregarProducto = document.getElementById('formAgregarProducto')
// formAgregarProducto.addEventListener('submit', e => {
//     e.preventDefault()
//     const nuevoProducto = true
//     // //Armar objeto producto y emitir mensaje a evento update
//     // let nombre = document.getElementById('nombre').value
//     // let precio = document.getElementById('precio').value
//     // let file = document.getElementById('foto').value 

//     // let nuevoProducto = {
//     //     title: nombre,
//     //     price: precio,
//     //     thumbnail: foto
//     // }
//     socket.emit('nuevoProducto', nuevoProducto)
// })

function makeHtmlTable(productos) {
    return fetch('./plantillas/tablaProductos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            productos = JSON.parse(productos)
            const html = template({ productos: productos })
            return html
        })
}

let divProductos = document.getElementById('productos')
if (productos) {
    console.log(productos)
    console.log('Hay productos')
}
// socket.on('productos', productos => {
//     //generar el html y colocarlo en el tag productos llamando a la funcion makeHtmlTable
//     let divProductos = document.getElementById('productos')
//     makeHtmlTable(productos)
//     .then((html)=>{
//         divProductos.innerHTML = html
//     })
// });
