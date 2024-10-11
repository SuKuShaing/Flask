# Practica de Flask

Siguiendo el tutorial de Fazt:
Python, PostgreSQL & Javascript - Aplicación Web CRUD (Flask y Vanilla JS)
https://youtu.be/Qqgry8mezC8?si=bvYch9_FBEzMHut9

## Como ejecutar

1) activar el entorno virtual
    `$ source venv/Scripts/activate`

(Opcional) Instalar todas las dependencias
-  `$ pip install -r requirements.txt` : para instalar todas las dependencias

2) ejecutar el proyecto
-  Ubicarse en la carpeta
-  `$ py app.py`


# Qué es el archivo Procfile
El archivo profile es para indicarle al servidor qué comandos deben ser utilizados para correr la aplicación

`gunicorn app:app` comando escrito en el archivo
`librería nombreDelArchivo:NombreDelObjetoEnFlaskAEditar` esta es la estructura
gunicorn es la librería mediante la cual lo va a hacer
nombreDelArchivo es literalmente eso, el nombre del archivo a ejecutar
NombreDelObjetoEnFlaskAEditar es como se llama la instancia de flask que corre la aplicación