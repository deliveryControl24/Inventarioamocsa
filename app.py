from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import os
import logging

app = Flask(__name__)
INVENTARIO_FILE = 'inventario.json'

# Configurar el registro
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def cargar_inventario():
    if os.path.exists(INVENTARIO_FILE):
        with open(INVENTARIO_FILE, 'r') as file:
            return json.load(file)
    return {}

def guardar_inventario(inventario):
    with open(INVENTARIO_FILE, 'w') as file:
        json.dump(inventario, file)
    logger.info("Inventario guardado correctamente.")

@app.route('/')
def index():
    inventario = cargar_inventario()
    return render_template('index.html', inventario=inventario)

@app.route('/agregar_producto', methods=['POST'])
def agregar_producto():
    nombre = request.form['nombre']
    cantidad = int(request.form['cantidad'])

    inventario = cargar_inventario()

    if nombre in inventario:
        inventario[nombre]['cantidad'] += cantidad
        logger.info(f"Producto '{nombre}' actualizado con cantidad {cantidad}.")
    else:
        inventario[nombre] = {'nombre': nombre, 'cantidad': cantidad}
        logger.info(f"Producto '{nombre}' agregado con cantidad {cantidad}.")

    guardar_inventario(inventario)
    return redirect(url_for('index'))

@app.route('/actualizar_cantidad', methods=['POST'])
def actualizar_cantidad():
    nombre = request.form['nombre']
    cantidad = int(request.form['cantidad'])

    inventario = cargar_inventario()

    if nombre in inventario:
        inventario[nombre]['cantidad'] = cantidad
        guardar_inventario(inventario)
        logger.info(f"Cantidad de '{nombre}' actualizada a {cantidad}.")
        return redirect(url_for('index'))
    else:
        logger.error(f"Producto '{nombre}' no encontrado.")
        return "Producto no encontrado", 404

@app.route('/eliminar_producto', methods=['POST'])
def eliminar_producto():
    nombre = request.form['nombre']

    inventario = cargar_inventario()

    if nombre in inventario:
        del inventario[nombre]
        guardar_inventario(inventario)
        logger.info(f"Producto '{nombre}' eliminado.")
        return redirect(url_for('index'))
    else:
        logger.error(f"Producto '{nombre}' no encontrado.")
        return "Producto no encontrado", 404

if __name__ == '__main__':
    app.run(debug=True)
