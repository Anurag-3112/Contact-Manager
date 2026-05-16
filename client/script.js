const API = "http://localhost:5000";

let editingId = null;

async function addContact() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    if (!name || !phone || !email) {
        alert("All fields are required");
        return;
    }

    const url = editingId
        ? API + "/contacts/" + editingId
        : API + "/contacts";

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email })
    });

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";

    editingId = null;
    document.getElementById("saveBtn").textContent = "Save";

    loadContacts();


}

async function loadContacts() {
  try {
    const search = document.getElementById("search").value;
    const sort = document.getElementById("sort").value;

    const res = await fetch(
      `${API}/contacts?search=${search}&sort=${sort}`
    );

    if (!res.ok) {
      throw new Error(`Server Error: ${res.status}`);
    }

    const data = await res.json();

    const list = document.getElementById("contactList");
    list.innerHTML = "";

    data.forEach(c => {
      const div = document.createElement("div");
      div.className = "contact";

      div.innerHTML = `
        <strong>${c.name}</strong>
        <span>${c.phone}</span>
        <span>${c.email}</span>

        <div class="actions">
          <button class="edit"
            onclick="editContact('${c._id}', '${c.name}', '${c.phone}', '${c.email}')">
            Edit
          </button>

          <button class="delete"
            onclick="deleteContact('${c._id}')">
            Delete
          </button>
        </div>
      `;

      list.appendChild(div);
    });

  } catch (err) {
    console.error("Load Error:", err);
  }
}

async function deleteContact(id) {
    await fetch(API + "/contacts/" + id, {
        method: "DELETE"
    });

    loadContacts();


}

function editContact(id, name, phone, email) {
    document.getElementById("name").value = name;
    document.getElementById("phone").value = phone;
    document.getElementById("email").value = email;


    editingId = id;
    document.getElementById("saveBtn").textContent = "Update";


}

loadContacts();
