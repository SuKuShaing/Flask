const userForm = document.querySelector('#userForm')

window.addEventListener('DOMContentLoaded', async () => { // escucha el evento DOMContentLoaded que se dispara cuando el documento HTML ha sido completamente cargado y parseado
    const response = await fetch('/api/users') // fetch es una función que permite hacer peticiones HTTP desde el cliente
    // con el método GET no es necesario enviar un objeto con las opciones de la petición
    const data = await response.json() // convierte la respuesta a JSON
    console.log(data)
})

// Crea un usuario en la base de datos usando el formulario
userForm.addEventListener('submit', async (e) => { // escucha el evento submit del formulario
    // async, es para hacer referencia que dentro de la función hay código asíncrono
    e.preventDefault() // previene el comportamiento por defecto del formulario, es decir, no recarga la página
    
    const username = userForm["userName"].value
    const email = userForm["email"].value
    const password = userForm["password"].value

    /* 
    // Estrucutra de una petición fetch
    fetch('Endpoint/del/Servidor', { // fetch recibe dos parámetros, el primero es la URL del servidor y el segundo es un objeto con las opciones de la petición
        method: 'MetodoDeLaPetición', // método de la petición, puede ser GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
        headers: { // cabeceras de la petición
            'Content-Type': 'application/json' // tipo de contenido que se está enviando
        },
        body: JSON.stringify({ // cuerpo de la petición, se convierte a JSON
            userName, // datos del formulario
            email, // datos del formulario
            password // datos del formulario
        })
    })
    */

    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            username, 
            email, 
            password
        })
    })

    const data = await response.json()
    console.log(data)

    userForm.reset() // limpia los campos del formulario
})