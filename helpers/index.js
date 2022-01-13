
const dbValidators = require('./db_validator');
const generateJWT = require('./generate_jwt');
const googleVerify = require('./google_verify');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleVerify,
    ...subirArchivo   
}