const { Schema, model } = require('mongoose');
//El archivo debe llamarse igual que la coleccion peroooo en singular, la coleccion se llama 
//usuarios entonces el archivo se llamara usuario sin 'S'

const ProductSchema = Schema({
    //nombre del campo en el documento(db)
    name:{
        type:String,
        required: [true, 'El nombre debe de ser obligatorio'],
    },
    state:{
        type: Boolean,
        default: true,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    serie:{
        type: String
    },
    
    category:{
        type:Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    
    description: { type:String},
    disponible: { type:Boolean, default: true},
    img: { type: String}
});

ProductSchema.methods.toJSON = function(){
    const { __v, state , ...categoria } = this.toObject();
    return categoria;

}

module.exports = model('Producto', ProductSchema);
