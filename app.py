from flask import Flask, request
# requests es para extraer los datos de la petición que está haciendo el cliente
from psycopg2 import connect

app = Flask(__name__)


# Obtiene la conexión a la base de datos
host = 'localhost'
port = '5432'
dbname = 'usersdb-fazt'
user = 'fast_user'
password = 'fast_user'

def get_connection():
    conn = connect(host=host, port=port, dbname=dbname, user=user, password=password)
    return conn


# Página inicial
@app.route('/')
def hello_world():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT 2 + 1')
    result = cursor.fetchone()

    print(result)
    return 'Hello, World! The result is: ' + str(result)

@app.get('/api/users')
def get_users():
    return 'getting users'

@app.post('/api/users')
def create_users():
    new_user = request.get_json()
    username = new_user['username']
    email = new_user['email']
    password = new_user['password']

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)', (username, email, password))

    return 'creating users'

@app.delete('/api/users/1')
def delete_users():
    return 'deliting users'

@app.put('/api/users/1')
def update_users():
    return 'updating users'

@app.get('/api/users/1')
def get_user():
    return 'getting user 1'

if __name__ == '__main__':
    app.run(debug=True)