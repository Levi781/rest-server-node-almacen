const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');

const validarJWT = async( req = request, res = response, next )=>{

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );


        const userAutenticado =await Usuario.findById( uid );

        if( !userAutenticado){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe'
            });
        }
        //Verificar si el usuario esta activo

        if( !userAutenticado.estado ){
            return res.status(401).json({
                msg: 'Token no valido - Usuario desactivado'
            });
        }

        req.usuario = userAutenticado;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        });
    }

}

module.exports = {
    validarJWT
}