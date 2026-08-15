const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de la aplicación
app.use('/api', routes);

module.exports = app;
