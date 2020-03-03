//=========================
// VERIFICACIÓN DEL TOKEN
//=========================
const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => { //CallBack que maneja el error si no se verifica correctamente el token, si tiene un dato erróneo, 
        //o la firma no coincide o la fecha de vencimiento ya pasó
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    menssage: 'Token no válido'
                }
            })
        }
        //Se envia la información de usuario desde el payload al req.usuario
        req.usuario = decoded.usuario;
        //Continua la ejecución del programa pues se ha verificado el token
        next();
    })
}

let verificaRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else
        return res.status(401).json({
            ok: false,
            err: {
                menssage: 'Usuario no es administrador'
            }
        });

}

module.exports = { verificaToken, verificaRole };