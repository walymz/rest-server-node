//Requiere el archivo de configuración global, 
//al hacer esto se ejecuta todo el contenido del archivo

require('./config/config');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.get('/', function(req, res) {
    res.json('Hello World')
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto 3000 ${process.env.PORT}`);
})