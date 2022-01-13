const { validationResult } = require('express-validator');

const validarCampos = (req, res, next)=>{

    const errors = validationResult( req );
    
    if( !errors.isEmpty() ){
        return res.status(200).json(  errors );
    }

    //Si llega a esta punto sigue con el middleware sig. 
    next();
}

module.exports = {validarCampos};