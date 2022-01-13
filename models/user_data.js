const { Schema, model } = require('mongoose');

const UsuarioData = Schema({



    "nombre": {
        type: String,
        required: true
    },

    "apellidos":{
        type: String,
        required : true 
    },

    "depto":{
        type: String
    },

    "puesto":{
        type: String
    },
    "estado":{
        type: Boolean,
        default: true
    }

});

module.exports = model( 'Usuario_Data', UsuarioData );