from flask import Flask, request, jsonify, send_file
from psycopg2 import connect, extras
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from os import environ

# requests es para extraer los datos de la petición que está haciendo el cliente
# jsonify permite devolver un diccionario (un objeto) como un json
# send_file es para enviar un archivo al cliente

# psycopg2 es para conectarse a la base de datos
# connect es para conectarse a la base de datos
# extras es para obtener los datos de la base de datos no como tuplas sino como diccionarios

# Fernet es para encriptar y desencriptar datos
# load_dotenv es para cargar las variables de entorno del archivo .env
# environ es para obtener las variables de entorno


# Se debe ejecutar a penas carga la aplicación para cargar las variables de entorno
load_dotenv()  # carga las variables de entorno del archivo .env

app = Flask(__name__)
key = Fernet.generate_key()
# Fernet.generate_key() genera una clave para encriptar y desencriptar datos, lo usaremos para encriptar las contraseñas


# Obtiene la conexión a la base de datos
host = environ.get("DB_HOST")
port = environ.get("DB_PORT")
dbname = environ.get("DB_NAME")
user = environ.get("DB_USER")
password = environ.get("DB_PASSWORD")


def get_connection():
    conn = connect(host=host, port=port, dbname=dbname, user=user, password=password)
    return conn

"""
@app.route("/")
def hello_world():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT 2 + 1")
    result = cursor.fetchone()

    print(result)
    return "Hello, World! The result is: " + str(result)
"""

# Ruta para obtener todos los usuarios, se usa el método GET
@app.get("/api/users")
def get_users():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)  # con cursor_factory=extras.RealDictCursor se obtienen los datos de la base de datos como diccionarios

    cur.execute("SELECT * FROM users")
    result = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(result)


# Ruta para crear usuarios, se usa el método POST
@app.post("/api/users")
def create_users():
    new_user = request.get_json()
    username = new_user["username"]
    email = new_user["email"]
    password = Fernet(key).encrypt(
        bytes(new_user["password"], "utf-8")
    )  # le pasamos un string en utf-8, lo pasa a bits y lo encripta

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=extras.RealDictCursor)
    # con cursor_factory=extras.RealDictCursor se obtienen los datos de la base de datos como diccionarios

    cursor.execute(
        "INSERT INTO users (username, email, password) VALUES (%s, %s, %s) RETURNING *",
        (username, email, password),
    )
    new_creadted_user = (
        cursor.fetchone()
    )  # fetchone() para obtener el resultado de la inserción que retorna el RETURNING
    print(new_creadted_user)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(new_creadted_user)


# Ruta para eliminar usuarios, se usa el método DELETE
@app.delete("/api/users/<id>")
def delete_users(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("DELETE FROM users WHERE id = %s RETURNING * ", (id,))
    user = cur.fetchone()  # fetchone() para obtener el usuario eliminado

    conn.commit()

    cur.close()
    conn.close()

    print(user)

    if user is None:
        return jsonify({"message": "User not found"}), 404
        # 404 es el código de error de no encontrado para el cliente
        # y para el usuario es un mensaje de que no se encontró el usuario

    return jsonify(user)


# Ruta para actualizar usuarios, se usa el método PUT
@app.put("/api/users/<id>")
def update_users(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    new_user = request.get_json()
    username = new_user["username"]
    email = new_user["email"]
    password = Fernet(key).encrypt(bytes(new_user["password"], "utf-8"))
    # Se deben enviar todos los campos, sino falla

    cur.execute(
        "UPDATE users SET username = %s, email = %s, password = %s WHERE id = %s RETURNING *",
        (username, email, password, id),
    )
    update_users = cur.fetchone()

    conn.commit()

    cur.close()  # primero cerramos el cursor
    conn.close()  # luego cerramos la conexión

    if update_users is None:
        return jsonify({"message": "User not found"}), 404

    return jsonify(update_users)


@app.get("/api/users/<id>")
def get_user(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM users WHERE id = %s", (id,))
    user = cur.fetchone()

    if user is None:
        return jsonify({"message": "User not found"}), 404
        # 404 es el código de error de no encontrado para el cliente
        # y para el usuario es un mensaje de que no se encontró el usuario

    return jsonify(user)


@app.get("/")
def home():
    return send_file("static/index.html")


if __name__ == "__main__":
    app.run(debug=True)
