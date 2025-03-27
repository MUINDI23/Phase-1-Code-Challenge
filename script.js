const serverURL = "http://localhost:3000/items";

// DOM Elements
const form = document.getElementById("add-item-form");
const itemsList = document.getElementById("items");

function fetchItems() {
    fetch(serverURL)
        .then(response => response.json())
        .then(items => {
            itemsList.innerHTML = ""; 
            items.forEach(item => displayItem(item));
        })
        .catch(error => console.error("Error fetching items:", error));
}

// Function to display an item in the list
function displayItem(item) {
    const listItem = document.createElement("li");
    listItem.classList.add("item");
    listItem.innerHTML = `
        <span>${item.name} - $${item.price}</span>
        <button data-id="${item.id}">Delete</button>
    `;
    itemsList.appendChild(listItem);
}

// Function to add a new item 
function addItem(event) {
    event.preventDefault(); 

    const name = document.getElementById("item-name").value;
    const price = document.getElementById("item-price").value;

    fetch(serverURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, price })
    })
        .then(response => response.json())
        .then(newItem => {
            displayItem(newItem);
            form.reset(); 
        })
        .catch(error => console.error("Error adding item:", error));
}

// Function to delete an item
function deleteItem(itemId) {
    fetch(`${serverURL}/${itemId}`, {
        method: "DELETE"
    })
        .then(() => {
            // Remove item from the DOM
            const itemElement = document.querySelector(`button[data-id="${itemId}"]`).parentElement;
            itemElement.remove();
        })
        .catch(error => console.error("Error deleting item:", error));
}

// Event Listeners
form.addEventListener("submit", addItem);

itemsList.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        const itemId = event.target.dataset.id;
        deleteItem(itemId);
    }
});

// Initial fetch of items
fetchItems();