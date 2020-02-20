const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        //Se define unique pero se usa el plugin unique-validator de mongoose para personalizar el error
        unique: true,
        required: [true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: rolesValidos,
        //rolesValidos se define arriba, junto con un mensaje personalizado
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.new
    }

});
/**
 * El siguiente método se usa para modificar
 * el método interno para mostrar información del JSON
 * de tal manera que no se envíe el campo de contraseña 
 * en el JSON de respuesta de la api. Se usa function, no 
 * función de flecha dado que se manipula el objeto this
 */
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
usuarioSchema.plugin(uniquevalidator, { message: '{PATH} debe ser único' })
    //{PATCH va a ser reemplazado por el campo únique que haya tenido error}
module.exports = mongoose.model('Usuario', usuarioSchema);
//Se exporta el modelo, con el nombre de Usuario, y la configuración dada en usuarioSchema