//Propias de java
const { response } = require('express');
const bcrypjs = require('bcryptjs');

//Modelos
const {Usuario} = require('../models');

const usuariosGet = async(req, res = response)=> {

    const { limite = 5, desde = 0 } = req.query;

    // if( typeof limite === Number || typeof desde !== Number ){
    //     return res.json({ errors: 'No es un numero'});
    // }

    const query = { state: true, role: 'USER_ROLE'};

    // const usuarios  = await Usuario.find( query )
    //     .skip( Number(desde) )
    //     .limit( Number(limite) );

    // const total = await Usuario.countDocuments( query );

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
    ]);

    res.json( { total, usuarios } );
}

const usuariosGetbyId = async(req, res = response)=> {

    const { id } = req.params;
    const query = { state: true };

    const existe = await Usuario.findById( id );

    if( !existe ){
        return res.status(401).json({
            results: `El id ${id} no existe`
        });
    }
    

    res.json( { results: [ existe ] } );
}

const usuariosPut = async (req, res)=> {

    const { id } = req.params;
    const {estado } = req.body;
    console.log( req.params );
    console.log( req.body );

    const usuario = await Usuario.findByIdAndUpdate( id , { estado });

    res.json(usuario)
}

const usuariosPost = async (req, res)=> {


    const { nombre, username ,email, password, role } = req.body;
    const usuario = new Usuario({ nombre, username ,email, password, role, estado: false });

    //Encriptar la contraseña
    const salt = bcrypjs.genSaltSync();//default 10
    usuario.password = bcrypjs.hashSync( password, salt );
    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosDelete = async(req, res)=> {

    const { id } = req.params;
    
    //Fisicamente se borra
    //const usuario = await Usuario.findByIdAndDelete( id );

    //Cambiar el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate( id, { state: false } );
    //const autenticado = req.usuario;

    res.json({
       usuario
       //autenticado
    })
}

const usuariosPatch = (req, res)=> {

    res.json({
        ok: true,
        msg : 'patch api - controlador'
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    usuariosGetbyId
}




