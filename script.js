document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const cantidad = parseInt(document.getElementById('cantidad').value);

        const response = await fetch('/agregar_producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, cantidad })
        });

        const data = await response.json();
        alert(data.mensaje);
        location.reload();
    });
});
