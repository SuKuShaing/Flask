const userForm = document.querySelector('#userForm')

let users = []

// Obtiene los usuarios de la base de datos
window.addEventListener('DOMContentLoaded', async () => { // escucha el evento DOMContentLoaded que se dispara cuando el documento HTML ha sido completamente cargado y parseado
    const response = await fetch('/api/users') // fetch es una función que permite hacer peticiones HTTP desde el cliente
    // con el método GET no es necesario enviar un objeto con las opciones de la petición
    const data = await response.json() // convierte la respuesta a JSON
    users = data
    renderUser(users)
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

    const data = await response.json() // La API a responde con los datos creados en la base de datos y esos datos se guardan en response
    console.log(data)

    users.unshift(data)
    renderUser(users)

    userForm.reset() // limpia los campos del formulario
})

// Renderiza a los usuarios en la pantalla
function renderUser(users) {
    // console.log(users)
    const userList = document.querySelector('#userList')
    userList.innerHTML = '' // limpia el contenido del elemento
    
    // <li class="list-group-item">item 1</li>

    users.forEach(user => {
        const userItem = document.createElement('li')
        userItem.classList = 'list-group-item list-group-item-dark my-2' 
        // userItem.classList.add('list-group-item') // agrega solo una clase a la vez al elemento
        userItem.innerHTML = `
            <header class="d-flex justify-content-between align-items-center">
                <h3>${user.username}</h3>

                <div class="d-flex align-items-center">
                    <button class="btn btn-warning btn-sm">Editar</button>
                    <button class="btn btn-danger btn-sm">Eliminar</button>
                </div>
            </header>
            <p>${user.email}</p>
            <p class="text-truncate">${user.password}</p>
        `
        userList.append(userItem)
    });
}