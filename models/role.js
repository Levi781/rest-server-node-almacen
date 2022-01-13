const { Schema, model } = require('mongoose');
//El archivo debe llamarse igual que la coleccion peroooo en singular, la coleccion se llama 
//usuarios entonces el archivo se llamara usuario sin 'S'

const RoleSchema = Schema({
    //nombre del campo en el documento(db)
    nombre:{
        type:String,
        required: [true, 'El rol debe de ser obligatorio']
    }
});

module.exports = model('Roles', RoleSchema);
