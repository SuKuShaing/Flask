const userForm = document.querySelector("#userForm");

let users = [];
let editing = false;
let userIdEdit = null;

// Obtiene los usuarios de la base de datos
window.addEventListener("DOMContentLoaded", async () => {
	// escucha el evento DOMContentLoaded que se dispara cuando el documento HTML ha sido completamente cargado y parseado
	const response = await fetch("/api/users"); // fetch es una función que permite hacer peticiones HTTP desde el cliente
	// con el método GET no es necesario enviar un objeto con las opciones de la petición
	const data = await response.json(); // convierte la respuesta a JSON
	users = data;
	renderUser(users);
});

// Crea un usuario en la base de datos usando el formulario
userForm.addEventListener("submit", async (e) => {
	// escucha el evento submit del formulario
	// async, es para hacer referencia que dentro de la función hay código asíncrono
	e.preventDefault(); // previene el comportamiento por defecto del formulario, es decir, no recarga la página

	const username = userForm["userName"].value;
	const email = userForm["email"].value;
	const password = userForm["password"].value;

	if (!editing) {
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

		const response = await fetch("/api/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				email,
				password,
			}),
		});

		const data = await response.json(); // La API a responde con los datos creados en la base de datos y esos datos se guardan en response
		console.log(data);

		users.unshift(data);
	} else {
		const response = await fetch(`/api/users/${userIdEdit}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				email,
				password,
			}),
		});

		const updatedUser = await response.json();
		console.log(updatedUser);

		users = users.map(user => user.id === updatedUser.id ? updatedUser : user);
		renderUser(users);

		// para que las variables vuelvan a su estado original
		editing = false;
		userIdEdit = null;
	}

	renderUser(users);

	userForm.reset(); // limpia los campos del formulario
});

// Renderiza las tarjetas de los usuarios en la pantalla
function renderUser(users) {
	// console.log(users)
	const userList = document.querySelector("#userList");
	userList.innerHTML = ""; // limpia el contenido del elemento

	users.forEach((user) => {
		const userItem = document.createElement("li"); //createElement crea un elemento HTML y se pueden usar los métodos de los elementos del DOM
		userItem.classList = "list-group-item list-group-item-dark my-2";
		// userItem.classList.add('list-group-item') // agrega solo una clase a la vez al elemento
		userItem.innerHTML = `
            <header class="d-flex justify-content-between align-items-center">
                <h3>${user.username}</h3>

                <div class="d-flex align-items-center">
                    <button class="btn-edit btn btn-warning btn-sm">Editar</button>
                    <button class="btn-delete btn btn-danger btn-sm">Eliminar</button>
                </div>
            </header>
            <p>${user.email}</p>
            <p class="text-truncate">${user.password}</p>
        `;

		const btnDelete = userItem.querySelector(".btn-delete");
		btnDelete.addEventListener("click", async () => {
			const response = await fetch(`/api/users/${user.id}`, {
				method: "DELETE",
			});
			const data = await response.json();
			console.log(data);

			users = users.filter((user) => user.id !== data.id); // elimina de la lista al usuario eliminado, el filter mantiene a todos los usuario true y elimina al false
			renderUser(users);
		});

		const btnEdit = userItem.querySelector(".btn-edit");
		btnEdit.addEventListener("click", async () => {
			// obtiene los datos del usuario desde la base de datos
			const response = await fetch(`/api/users/${user.id}`);
			const data = await response.json();

			// cargamos los datos del usuario en el formulario
			userForm["userName"].value = data.username;
			userForm["email"].value = data.email;
			userForm["password"].value = "";

			editing = true;
			userIdEdit = user.id;
		});

		userList.append(userItem);
	});
}
