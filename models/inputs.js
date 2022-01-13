const { Schema, model } = require('mongoose');

const EntradasSalidasSchema = Schema({
    idu :{
        type: Schema.Types.ObjectId,
        ref: 'Usuario_Data',
        required: true
    },
    idp :{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    salida: {
        type: String
    },
    entrada:{
        type: String
    }
});

module.exports = model('Entradas_Salida', EntradasSalidasSchema);