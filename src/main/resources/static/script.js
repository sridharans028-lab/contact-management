const API_URL = "/api/contacts";
const contactForm = document.getElementById("contactForm");
const contactIdInput = document.getElementById("contactId");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const formTitle = document.getElementById("formTitle");
const saveButton = document.getElementById("saveButton");
const cancelEditButton = document.getElementById("cancelEdit");
const formMessage = document.getElementById("formMessage");
const contactsTable = document.getElementById("contactsTable");
const searchInput = document.getElementById("searchInput");
const totalCount = document.getElementById("totalCount");
const resultCount = document.getElementById("resultCount");
const directoryFooter = document.getElementById("directoryFooter");

let allContacts = [];

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
}

function showMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.classList.toggle("error", isError);
}

async function loadContacts() {
    contactsTable.innerHTML = '<tr><td colspan="4" class="empty-cell">Loading contacts...</td></tr>';
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Could not load contacts.");
        allContacts = await response.json();
        totalCount.textContent = allContacts.length;
        renderContacts();
        directoryFooter.textContent = "Your contact list is up to date.";
    } catch (error) {
        contactsTable.innerHTML = `<tr><td colspan="4" class="empty-cell">${escapeHtml(error.message)} Check that the Spring Boot application and MySQL are running.</td></tr>`;
        resultCount.textContent = "Unavailable";
        directoryFooter.textContent = "Unable to connect to the server.";
    }
}

function renderContacts() {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = allContacts.filter((contact) =>
        [contact.name, contact.phone, contact.email].some((value) =>
            String(value).toLowerCase().includes(keyword)
        )
    );
    resultCount.textContent = `${filtered.length} record${filtered.length === 1 ? "" : "s"}`;

    if (filtered.length === 0) {
        contactsTable.innerHTML = `<tr><td colspan="4" class="empty-cell">${keyword ? "No matching contacts found." : "No contacts yet. Add your first contact using the form."}</td></tr>`;
        return;
    }

    contactsTable.innerHTML = filtered.map((contact) => {
        const initial = escapeHtml(contact.name.trim().charAt(0).toUpperCase());
        return `
            <tr>
                <td><div class="contact-cell"><div class="contact-avatar">${initial}</div><strong>${escapeHtml(contact.name)}</strong></div></td>
                <td>${escapeHtml(contact.phone)}</td>
                <td>${escapeHtml(contact.email)}</td>
                <td><div class="action-group">
                    <button class="action-btn edit-btn" data-action="edit" data-id="${contact.id}">Edit</button>
                    <button class="action-btn delete-btn" data-action="delete" data-id="${contact.id}">Delete</button>
                </div></td>
            </tr>`;
    }).join("");
}

function resetForm() {
    contactForm.reset();
    contactIdInput.value = "";
    formTitle.textContent = "Add a contact";
    saveButton.textContent = "＋ Save contact";
    cancelEditButton.classList.add("hidden");
    showMessage("");
}

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim()
    };

    if (!payload.name || !payload.phone || !payload.email) {
        showMessage("Please complete all three fields.", true);
        return;
    }

    const id = contactIdInput.value;
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? "PUT" : "POST";
    saveButton.disabled = true;
    saveButton.textContent = id ? "Updating..." : "Saving...";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "Unable to save contact.");
        resetForm();
        showMessage(id ? "Contact updated successfully." : "Contact added successfully.");
        await loadContacts();
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = contactIdInput.value ? "Update contact" : "＋ Save contact";
    }
});

contactsTable.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const contact = allContacts.find((item) => item.id === id);
    if (!contact) return;

    if (action === "edit") {
        contactIdInput.value = contact.id;
        nameInput.value = contact.name;
        phoneInput.value = contact.phone;
        emailInput.value = contact.email;
        formTitle.textContent = "Edit contact";
        saveButton.textContent = "Update contact";
        cancelEditButton.classList.remove("hidden");
        showMessage("Update the details and select Update contact.");
        document.getElementById("contactFormPanel").scrollIntoView({ behavior: "smooth", block: "start" });
        nameInput.focus();
    }

    if (action === "delete") {
        if (!window.confirm(`Delete ${contact.name} from your contacts?`)) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "Unable to delete contact.");
            if (contactIdInput.value === String(id)) resetForm();
            await loadContacts();
        } catch (error) {
            window.alert(error.message);
        }
    }
});

cancelEditButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderContacts);
document.getElementById("refreshButton").addEventListener("click", loadContacts);
loadContacts();
