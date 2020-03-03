const express = require('express');
const app = express();
//Para acceder a información del usuario
const Usuario = require('./../models/usuarioModels');
//Encriptación de contraseña
const bcrypt = require('bcrypt');

//Uso de jwt con el componente jsonwebtoken para generar el token
const jwt = require('jsonwebtoken');


app.post('/login', (req, res) => {
    //Guardo el body en una variable
    let body = req.body;

    /*Acá se busca en el modelo de datos Usuario, usando el método findOne al cual se le indica 
    que el campo email sea igual a body.mailpara la búsqueda del usuario
    luego se devuelve un callback para el manejo de la información devuelta (usuarioDB) o un 
    error si no se consiguió el usuario
    */
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        //Error que se presenta por problemas en la conexión de la BD en el servidor (error 500)
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El usuario* o contraseña no coinciden con los registrados"
                }
            });
        }
        /**
         * En el siguiente código se usa el método compareSync perteneciente a bcrypt, 
         * para comparar el password que viene en body (introducido por el usuario)
         * contra el password que está registrado en la BD para ese usuario,
         * que se encuentra en usuarioDB -regresado en la búsqueda-
         * Si el método es false es porque no coinciden los password, y se genera el error,
         * si es true obviamente continua y retorna la respuesta del servidor con el usuario validado
         * y su token
         */
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "El usuario o contraseña* no coinciden con los registros"
                }
            });
        };
        let token = jwt.sign(
            //Datos del token (payLoad)
            { usuario: usuarioDB },
            //Semilla del token: firma que se utiliza para validar el token en el servidor
            process.env.SEED,
            //Fecha de expiración y semilla: se usa las variables de entorno configuradas
            { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })
});
module.exports = app;