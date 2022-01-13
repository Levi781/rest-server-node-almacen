const { request, response } = require("express");
const {Categoria, Usuario} = require("../models");


const obtenerTodasCategorias = async( req = request, res = response )=>{

    const { desde = 0, hasta = 5 } = req.headers;
    // const categorias = await Categoria.find({ state: true});
    // const cantidad = await Categoria.countDocuments();
    const [ cantidad, categorias] = await Promise.all(
        [
            Categoria.countDocuments({ state:true }),
            Categoria.find({ state: true}).populate('user','name')
        ]
    );

    res.json({
        cantidad,
        categorias
    });

}

const obtenerCategoria = async( req = request, res = response )=>{

    const {id} = req.params;
    const categoria = await Categoria.findById( id );

    if( !categoria ){
        return res.status(401).json({
            msg: 'La categoria solicitada no existe'
        });
    }

    res.json({
        categoria
    });

}

const crearCategoria = async(req = request, res = response)=>{

    console.log(req.body);
    const name  = req.body.name.toUpperCase();
    const uid = req.body.uid;
    const user = await Usuario.findById( uid );

    if( !user ){
        return res.status(400).json({
            msg: `El usuario ${user} no existe`
        });
    }

    const categoriaDB = await Categoria.findOne({"name":name });
    console.log(categoriaDB);
    
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${name} ya existe`
        });
    }
    //Generar la tabla a guardar
    const data = {
        name,
        user
    }
    //Generamos la categoria
    const categoria = new Categoria( data );
    //Guardar en db
    await categoria.save();
    //console.log( categoria );
    res.status(201).json({
        categoria
    });
}

const actualizarCategoria = async( req, res = response )=>{

    const { id } = req.params;
    const { _id, status, user , ...data   } = req.body;
    
    //console.log(req.params);
    //console.log(req.body);
    //console.log(req.usuario);

//    console.log(resto.name);

    data.name = data.name.toUpperCase();
    data.user = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate( id , data,{ new: true});

    //res.json(categoria)
    res.json( categoria )
}

const borrarCategoria = async( req, res)=>{

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id , {state:false}, {new:true});

    res.json(categoria)
}



module.exports = {
    crearCategoria,
    obtenerTodasCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}