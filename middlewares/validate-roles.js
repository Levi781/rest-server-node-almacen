const { response, request } = require("express");

const esAdminRole = ( req = request, res = response, next )=>{

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Necesita verificar el token para verificar el role'
        });
    }

    const { role, name } = req.usuario ;

    if( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${ name } no es un administrador`
        });
    }

    next();

}


const tieneRole = ( ...roles )=>{

    return ( req = request, res = response, next) => {

        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Necesita verificar el token para verificar el role'
            });
        }

        if( !roles.includes( req.usuario.role ) ){
            return res.status(500).json({
                msg: `Necesita tener estos roles ${ roles } para eliminar`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}