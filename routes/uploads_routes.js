const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/upload_controller');
const { coleccionesPermitidas, existUserId } = require('../helpers/db_validator');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const { validarCampos } = require('../middlewares/validation-fields');

const router = Router();

router.post('/',[validarArchivoSubir], cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos']) ),
    validarCampos
], actualizarImagen);

router.get('/:coleccion/:id', mostrarImagen);

module.exports = router;