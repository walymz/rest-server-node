const express = require('express');
const app = express();


app.use(require('./../routes/loginRoutes'));
app.use(require('./../routes/usuarioRoutes'));

module.exports = app;