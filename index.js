

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use("/css", express.static(__dirname + "/css"));
app.use("/img", express.static(__dirname + "/img"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Conexión usando la URL pública o la variable de Railway
const connectionString = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;

const conexion = mysql.createConnection(connectionString);

conexion.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos de Railway:', err.message);
    return;
  }
  console.log('✅ Conexión exitosa a MySQL en Railway');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/validar', function(req, res) {
    const datos = req.body;
    const sql = 'INSERT INTO informacion (nombres, celular, correo, mensaje) VALUES (?, ?, ?, ?)';

    conexion.query(sql, [datos.nombres, datos.celular, datos.correo, datos.mensaje], function(error, result) {
    if (error) {
        console.error(error);
        return res.status(500).send('Error al guardar los datos');
    }
    res.send(`
        <script>
        alert('Datos guardados correctamente');
        window.location.href = '/';
        </script>
    `);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});