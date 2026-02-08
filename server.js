const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Conexión a MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "notes_app"
});

db.connect((err) => {
    if (err) {
        console.log("Error conectando a MySQL:", err);
    } else {
        console.log("Conectado a MySQL correctamente");
    }
});

// RUTA: Obtener todas las notas
app.get("/notas", (req, res) => {
    const sql = "SELECT * FROM notas";

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// RUTA: Crear nueva nota
app.post("/notas", (req, res) => {
    const { titulo, contenido } = req.body;
    const fecha = new Date().toISOString().split("T")[0];

    const sql = "INSERT INTO notas (Titulo, Contenido, Fecha) VALUES (?, ?, ?)";

    db.query(sql, [titulo, contenido, fecha], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ id: result.insertId });
        }
    });
});

// RUTA: Eliminar nota
app.delete("/notas/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM notas WHERE Id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ mensaje: "Nota eliminada" });
        }
    });
});

// RUTA: Editar nota
app.put("/notas/:id", (req, res) => {
    const id = req.params.id;
    const { titulo, contenido } = req.body;

    const sql = "UPDATE notas SET Titulo = ?, Contenido = ? WHERE Id = ?";

    db.query(sql, [titulo, contenido, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ mensaje: "Nota actualizada" });
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
