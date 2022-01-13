const validaCampos = require('../middlewares/validation-fields');
const validaJWT    = require('../middlewares/validate-jwt');
const validaRoles  = require('../middlewares/validate-roles');
const { validarArchivoSubir } = require('./validar-archivo');

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validarArchivoSubir
}