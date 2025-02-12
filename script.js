document.addEventListener("DOMContentLoaded", loadInventory);

function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const tableBody = document.querySelector("#inventoryTable tbody");
    tableBody.innerHTML = "";
    inventory.forEach((item, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td><input type="text" value="${item.producto}" onchange="updateProduct(${index}, 'producto', this.value)"></td>
            <td><input type="number" value="${item.cantidad}" onchange="updateProduct(${index}, 'cantidad', this.value)"></td>
            <td><input type="text" value="${item.categoria}" onchange="updateProduct(${index}, 'categoria', this.value)"></td>
            <td><button onclick="deleteProduct(${index})">Eliminar</button></td>
        `;
    });
}

function addProduct() {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory.push({ producto: "", cantidad: 0, categoria: "" });
    localStorage.setItem("inventory", JSON.stringify(inventory));
    loadInventory();
}

function updateProduct(index, key, value) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory[index][key] = value;
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function deleteProduct(index) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory.splice(index, 1);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    loadInventory();
}

function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem("inventory"));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "inventario.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        localStorage.setItem("inventory", e.target.result);
        loadInventory();
    };
    reader.readAsText(file);
}
