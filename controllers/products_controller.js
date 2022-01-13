const { request, response } = require("express");
const { existCategoria } = require("../helpers/db_validator");
const {Producto, Categoria} = require("../models");


const obtenerTodosProductos = async( req = request, res = response )=>{

    const { desde = 0, hasta = 5 } = req.headers;
    // const productos = await Producto.find({ state: true});
    // const cantidad = await Producto.countDocuments();
    const [ cantidad, productos] = await Promise.all(
        [
            Producto.countDocuments({ state:true }),
            Producto.find({ state: true}).populate('category','name')
        ]
    );

    // res.json(
    //     productos
    // );

    res.json({
        cantidad,
        productos
    });

}

const obtenerProducto = async( req = request, res = response )=>{

    const {id} = req.params;
    const producto = await Producto.findById( id );

    if( !producto ){
        return res.status(401).json({
            msg: 'El producto solicitado no existe'
        });
    }

    res.json({
        producto
    });

}

const crearProducto = async(req = request, res = response)=>{

    const name  = req.body.name.toUpperCase();
    console.log( req.body );

    const { description="Sin descripcion", idc, serie, idu, disponible=true} = req.body;

    const productoDB = await Producto.findOne( {serie} );

    //console.log( req.body );
    //console.log( req.params );
    
    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${name} ya existe`
        });
    }

    const categoryDB = await Categoria.findById( idc );

    if( !categoryDB ){
        return res.status(400).json({
            msg: `La categoria no existe`
        });
    }
    
    //Generar la tabla a guardar
    const data = {
        name,
        description,
        user: idu,
        category: idc,
        serie,
        disponible
    }
    //Generamos la producto
    const producto = new Producto( data );
    //Guardar en db

    await producto.save();
    //console.log( producto );
    res.status(201).json({
        producto
    });
}

const actualizarProducto = async( req, res = response )=>{

    const { id } = req.params;
    const { _id, status, user ,idc ,...data   } = req.body;
    
    console.log(req.params);
    console.log(req.body);
    //console.log(req.usuario);
    //console.log(resto.name);

    console.log( idc );

    if(idc){
        
        const exist = await Categoria.findById( idc );
        if( !exist ){
            return res.status(401).json({
                msg: 'La categoria no es valida'
            });
        }
    }

    data.category = idc;

    const producto = await Producto.findByIdAndUpdate( id , data ,{ new: true});

    //res.json(producto)
    res.json( producto )
}

const borrarProducto = async( req, res)=>{

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id , {state:false}, {new:true});

    res.json(producto)
}



module.exports = {
    crearProducto,
    obtenerTodosProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}