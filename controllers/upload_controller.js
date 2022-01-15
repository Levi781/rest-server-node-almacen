const path = require('path');
const fs = require('fs');
const { request, response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async(req = request, res = response)=>{

    if (!req.files.archivo) {
        res.status(400).json({msg:'No files were uploaded.'});
        return;
    }
    
    //
    try{
        const pathCompleto = await subirArchivo(  req.files ,['txt', 'md', 'png', 'jpg'], 'productos');
        res.json({
            nombre: pathCompleto
        });

    }catch(error){

        res.json({
            error
        });

    }

}

const actualizarImagen = async( req = request, res = response )=>{

    const { id, coleccion } = req.params;

    console.log( req.body );
    console.log( req.params );

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe el id ${id} - Usuario`
                });
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe el id ${id} - Producto`
                });
             }
            break;
        default: return res.status(500).json({
            msg: 'Esta ruta no la valida :c '
        });
    }

    try {
        if(modelo.img){
            const pathImagen = path.join( __dirname, '../uploads',coleccion, modelo.img );

            if(fs.existsSync( pathImagen )){
                fs.unlinkSync( pathImagen );
            }
        }

        const nombre = await subirArchivo(  req.files ,['png','jpeg', 'jpg'], coleccion);
        modelo.img = nombre;

        await modelo.save();

        res.status(201).json({
            results: [{
                msg: 'Imagen actualizada'
            }]
        });

    } catch (error) {
        
        return res.status(401).json({
            msg: 'Datos incompletos', error
        });
    }

}

const mostrarImagen = async( req, res )=>{

    const { id, coleccion } = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe el id ${id} - Usuario`
                });
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe el id ${id} - Producto`
                });
             }
            break;
        default: return res.status(500).json({
            msg: 'Esta ruta no la valide :c '
        });
    }

        //Limpiar imagenes
        if(modelo.img){
            const pathImagen = path.join( __dirname, '../uploads',coleccion, modelo.img );

            if(fs.existsSync( pathImagen )){
                return res.sendFile( pathImagen );
            }
        }


        return res.sendFile( path.join(__dirname ,'../assets/no-image.jpg') );
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}