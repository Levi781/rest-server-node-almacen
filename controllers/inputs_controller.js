const { request, response } = require("express");
const { Usuario, Producto, Entrada } = require("../models");
const  UsuarioData  = require('../models/user_data');

const getRegisterInput = async(req = request, res = response)=>{

    const entradas = await Entrada.find().populate('idu').populate('idp');

    return res.status(200).json({
        results: entradas
    });
}


const postRegisterInput = async( req = request, res = response )=>{

    const { idu, idp, salida} = req.body;

    const existUser = await UsuarioData.findById( idu );
    if( !existUser ){
        return res.status(401).json({
            result: 'No existe el usuario'
        });
    }
    const existProduct = await Producto.findById( idp );
    if( !existProduct ){
        return res.status(401).json({
            result: 'No existe el producto'
        });
    }

    const data = {
        idu,
        idp,
        salida,
        entrada : ""
    };

    const registro = new Entrada( data );
    await registro.save();
    await Producto.findByIdAndUpdate( idp , {disponible:false});

    res.status(201).json({
        results: registro
    });

}


const putRegisterInput = async( req = request, res = response )=>{
    const { idu, idp, entrada } = req.body;
    const { id } = req.params;
    console.log(id);
    const existUser = await UsuarioData.findById( idu );
    if( !existUser ){
        return res.status(401).json({
            msg: 'No existe el usuario'
        });
    }
    const existProduct = await Producto.findById( idp );
    if( !existProduct ){
        return res.status(401).json({
            msg: 'No existe el producto'
        });
    }
    
    const entradas = await Entrada.findByIdAndUpdate(id, { entrada });
    await Producto.findByIdAndUpdate( idp , {disponible:true});

    res.status(200).json({
        results: entradas
    });

}

const deleteRegisterInput = async( req= request, res = response )=>{
    const { idu, idp } = req.body;
    const existUser = await Usuario.findById( idu );
    if( !existUser ){
        return res.status(401).json({
            result: 'No existe el usuario'
        });
    }
    const existProduct = await Producto.findById( idp );
    if( !existProduct ){
        return res.status(401).json({
            result: 'No existe el producto'
        });
    }

    //TODO: Eliminar registro

    res.status(200).json({
        results: 'deleteRegister'
    });
    

}


module.exports = {
    postRegisterInput,
    putRegisterInput,
    deleteRegisterInput,
    getRegisterInput
}