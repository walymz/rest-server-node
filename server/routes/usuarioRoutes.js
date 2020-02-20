const express = require('express');
const app = express();
//Importación del modelo
const Usuario = require('./../models/usuarioModels');
//Encriptación de contraseña
const bcrypt = require('bcrypt');
//underscore, esta librería nos permite filtrar
//los campos que se van a permitir actualizar en el put
const _ = require('underscore');

app.get('/usuario', function(req, res) {
    /**
     * Regresa todos los registros si find no se encuentra filtrado por ningún criterio,
     * pero al colocarle los parámetros de 'desde' y 'limite' se puede controlar el 
     * tamaño de paginación que se va a tener
     */
    let desde = req.query.desde || 0; //indica que si no existe el parámetro entonces es cero
    desde = Number(desde); //el parámetro se transforma a número  (por defecto es string)

    let limite = req.query.limite || 5; //indica que si no existe el parámetro entonces es cero
    limite = Number(limite); //el parámetro se transforma a número  (por defecto es string)

    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            /**
             * El siguiente método: count, cuenta la cantidad
             * de registros que cumplen la condición que se especifica
             * entre llaves y devuelve el resultado con un callback.accordion
             * Acá se puede devolver el listado de dichos registros,
             * por lo cual se recomienda que la condición que se use parra
             * filtrar sea la misma utilizada en el método find
             */

            //Se cambió count por countDocuments porque el anterior está obsoleto
            Usuario.countDocuments({ estado: true }, (err, cantidad) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad
                })
            })


        })

});

app.post('/usuario', function(req, res) {

    let body = req.body;
    console.log(body);
    //Se crea una instancia del modelo de datos y se le pasa el valor de cada variable
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    })
    usuario.save((err, usuarioDB) => {
        if (err) {
            //Se retorna el código de error 400 de bad request y el json indicando ok false y el err
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //Si llega aquí no se produjo error y retorna el json con ok y el usuarioDB creado, 
        //No hace falta colocar el código de error porque se asume que fue exitoso
        res.json({
            ok: true,
            usuarioDB
        })
    })
});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'mail', 'img', 'role', 'estado']);
    /*
        //Se eliminan los campos que no se desean que sean actualizados por este método
        delete body.password;
        delete body.google;

        También se puede hacer utilizando una librería de javascript llamada underscore, cuando la cantidad
        de campos hace poco factible hacerlo con un delete a cada campo
    */
    /*
    Para que funcione la opción findByIdAndUpdate sin mensajes de Warning, se pasó la opción useFindAndModify: false
    en la conexión a la BD, dicha opción le dice a mongoose que no utilice el método useFindAndModify de forma nativa
    en los métodos de búsqueda y actualización dado que este método está obsoleto
    */
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBD
                //Acá se envía el usuarioBD de respuesta
        });
    })

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    //Propiedades que se desean cambiar, en este caso estado únicamente

    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado!'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Usuario eliminado!'
        })

    })


    /*
    El siguiente código elimina el registro de la BD

    //También se puede usar findByRemove, y desaparecerán los mensajes de warning dado que la opción useFindAndModify: false 
    //está establecida en la conexión a la BD
    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        };
        res.json({
            ok: true,
            message: 'Usuario eliminado ' + usuarioBorrado.id
        })

    }) 
    */
});

module.exports = app;