const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const saveBtn = document.getElementById("saveBtn");
const notesContainer = document.getElementById("notesContainer");

let editandoId = null;

// Cargar notas al iniciar
fetch("http://localhost:3000/notas")
.then(res => res.json())
.then(data => {
    data.forEach(nota => mostrarNota(nota));
});

saveBtn.addEventListener("click", function () {

    const titulo = titleInput.value;
    const contenido = contentInput.value;

    if (titulo === "" || contenido === "") {
        alert("Completa todos los campos");
        return;
    }

    if (editandoId) {
        // EDITAR NOTA
        fetch(`http://localhost:3000/notas/${editandoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, contenido })
        })
        .then(() => {
            notesContainer.innerHTML = "";
            cargarNotas();
            limpiarCampos();
            editandoId = null;
            saveBtn.textContent = "Guardar Nota";
        });

    } else {
        // CREAR NOTA
        fetch("http://localhost:3000/notas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, contenido })
        })
        .then(res => res.json())
        .then(nuevaNota => {
            mostrarNota({ id: nuevaNota.id, Titulo, Contenido });
        });
    }

    limpiarCampos();
});

function cargarNotas() {
    fetch("http://localhost:3000/notas")
    .then(res => res.json())
    .then(data => {
        data.forEach(nota => mostrarNota(nota));
    });
}

function mostrarNota(nota) {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note-card");

    noteDiv.innerHTML = `
        <h3>${nota.Titulo}</h3>
        <p>${nota.Contenido}</p>
        <div class="btn-group">
            <button class="edit-btn">✏️ Editar</button>
            <button class="delete-btn">❌ Eliminar</button>
        </div>
    `;

    // BOTÓN ELIMINAR
    noteDiv.querySelector(".delete-btn").addEventListener("click", function () {
        fetch(`http://localhost:3000/notas/${nota.Id}`, {
            method: "DELETE"
        }).then(() => {
            notesContainer.removeChild(noteDiv);
        });
    });

    // BOTÓN EDITAR
    noteDiv.querySelector(".edit-btn").addEventListener("click", function () {
        titleInput.value = nota.titulo;
        contentInput.value = nota.contenido;
        editandoId = nota.id;
        saveBtn.textContent = "Actualizar Nota";
    });

    notesContainer.appendChild(noteDiv);
}

function limpiarCampos() {
    titleInput.value = "";
    contentInput.value = "";
}
