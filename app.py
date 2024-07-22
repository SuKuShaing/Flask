from flask import Flask, request, jsonify
# requests es para extraer los datos de la petición que está haciendo el cliente
# jsonify permite devolver un diccionario como un json
from psycopg2 import connect, extras
# psycopg2 es para conectarse a la base de datos
# connect es para conectarse a la base de datos
# extras es para obtener los datos de la base de datos no como tuplas sino como diccionarios
from cryptography.fernet import Fernet
# Fernet es para encriptar y desencriptar datos


app = Flask(__name__)
key = Fernet.generate_key()
# Fernet.generate_key() genera una clave para encriptar y desencriptar datos


# Obtiene la conexión a la base de datos
host = "localhost"
port = "5432"
dbname = "usersdb-fazt"
user = "fast_user"
password = "fast_user"


def get_connection():
    conn = connect(host=host, port=port, dbname=dbname, user=user, password=password)
    return conn


# Página inicial
@app.route("/")
def hello_world():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT 2 + 1")
    result = cursor.fetchone()

    print(result)
    return "Hello, World! The result is: " + str(result)


@app.get("/api/users")
def get_users():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM users")
    result = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(result)


@app.post("/api/users")
def create_users():
    new_user = request.get_json()
    username = new_user["username"]
    email = new_user["email"]
    password = Fernet(key).encrypt(bytes(new_user["password"], "utf-8")) # le pasamos un string en utf-8, lo pasa a bits y lo encripta

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=extras.RealDictCursor)
    # con cursor_factory=extras.RealDictCursor se obtienen los datos de la base de datos como diccionarios

    cursor.execute(
        "INSERT INTO users (username, email, password) VALUES (%s, %s, %s) RETURNING *",
        (username, email, password),
    )
    new_creadted_user = cursor.fetchone() # fetchone() para obtener el resultado de la inserción que retorna el RETURNING
    print(new_creadted_user)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify(new_creadted_user)


@app.delete("/api/users/1")
def delete_users():
    return "deliting users"


@app.put("/api/users/1")
def update_users():
    return "updating users"


@app.get("/api/users/1")
def get_user():
    return "getting user 1"


if __name__ == "__main__":
    app.run(debug=True)
