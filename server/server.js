//Requiere el archivo de configuración global, 
//al hacer esto se ejecuta todo el contenido del archivo

require('./config/config');


const express = require('express');
const app = express();

//Cargando la librería de mongoose
const mongoose = require('mongoose');
//Se incluye el mongoose.set porque ahora parece que es un nuevo lineamiento
mongoose.set('useCreateIndex', true);
//Nuevo esquema para el uso de mongoose

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Carga las rutas, colocar después del bodyparse
app.use(require('./routes/usuarioRoutes'));


app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});
//Se incluyeron los parámetros useNewUrlParser y useUnifiedTopology porque ahora se exigen
mongoose.connect(process.env.urlBD, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => {
    if (err) throw err;
    console.log('BD conectada!');

});