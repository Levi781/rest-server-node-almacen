const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Producto, Categoria } = require('../models/index');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response )=>{

    const esMongoId = isValidObjectId( termino );

    if( esMongoId ){
        const usuario = await Usuario.findById( termino );

        if( !usuario ){
            return res.status(400).json({
                results: []
            });
        }

        return res.status(200).json({
           results: [usuario]
        });
    }

    const regexp = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({ 
        $or:  [{name: regexp},{email: regexp}],
        $and: [{state: true}]
      });

    res.json({
        results: usuarios 
    });
}

const buscarProductos = async (termino = '', res = response)=>{

    const esMongoid = await isValidObjectId( termino );
    if( esMongoid){
        
        const producto = await Producto.findById( termino ).populate('category', 'name');
        if( !producto ){
            return res.status(401).json({
                results: 'No existe el id'
            });
        }

        return res.status(200).json({
            results: [producto]
        });
    }

    if( Number(termino) ){
        const productos = await Producto.find(
            {price:termino}
        ).populate('category', 'name');

        return res.status(200).json({
            results: [productos]
        });
    }

    const regexp = new RegExp( termino, 'i' );
    const productos = await Producto.find({
        $or: [{ name: regexp }],
        $and: [{state:true}],
        
    }).populate('category', 'name');

    return res.status(200).json(
        {results: productos}
    );

}

const buscarCategoria = async ( termino = '', res = response)=>{

    const esMongoId = isValidObjectId( termino );

    console.log( termino );

    if( esMongoId ){
        const categoria = await Categoria.findById( termino );

        if( !categoria ){
            return res.status(400).json({
                results: []
            });
        }

        return res.status(200).json({
           results: [categoria]
        });
    }

    const regexp = new RegExp( termino, 'i' );
    const categoria = await Categoria.find({ 
       $or: [{name:regexp}]
      });

    res.json({
        results: categoria
    });
    
}


const searchProducts = ( req = request, res = response )=>{

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ){
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch( coleccion ){
        case 'categorias':
            buscarCategoria( termino , res);
            break;
        case 'productos':
            buscarProductos( termino, res );
            break;
        case 'usuarios':
            buscarUsuarios( termino, res );
            break;

        default: res.status(500).json({
            msg: 'Se me olvido hacer esta busqueda'
        });
    }
}

module.exports = {
    searchProducts
}