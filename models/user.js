// {
//     name: 'Jared Levi',
//     email: 'example@algo.com',
//     password: '13212',
//     img: 'url',
//     role: '2313132',
//     state: false,
//     google: false,

// }


const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],

    },
    username: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    password: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        required: true,
        //enum: ['ADMIN_ROLE', 'USER_ROLE']
    }
});


UsuarioSchema.methods.toJSON = function(){
    //Se realiza una desestructuracion y se quita la version y la contraseña por que 
    //es la respuesta que enviamos 
    const { __v, passwd, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;

}


module.exports = model( 'Usuario', UsuarioSchema );











