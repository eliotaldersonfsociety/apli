const express = require('express');

// Crear una instancia de express
const app = express();

// Middleware para permitir CORS (si es necesario, por ejemplo, si estás haciendo solicitudes desde un frontend)
const cors = require('cors');
app.use(cors());

// Ruta de prueba GET
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Ruta GET que devuelve un mensaje
app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'GET request received!' });
});

// Puerto en el que el servidor va a escuchar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
