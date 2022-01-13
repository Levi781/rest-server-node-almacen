const { Router } = require('express');
const { check } = require('express-validator');


const { crearCategoria, obtenerTodasCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categories_controller');
const { existCategoria, existProducto } = require('../helpers/db_validator');
const { validarCampos, validarJWT, tieneRole } = require('../middlewares');

const router = Router();



//Obtener todas las categorias public - paginado //headers 
router.get('/', obtenerTodasCategorias);

//Obtener categoria por id public
router.get('/:id',
    [
        check('id', 'El id es obligatorio').not().isEmpty(),
        check('id', 'No es un id Valido').isMongoId(),
        validarCampos
    ],
    obtenerCategoria
);

//Crear categoria - privado
router.post(
    '/:id',
    [
        //validarJWT,
        check('name', 'El nombre debe ser obligatorio').not().isEmpty(),
        check('id', 'El usuario debe ser obligatorio').not().isEmpty(),
        
    ], 
    crearCategoria
);

//Actualizar categoria - privado
router.put(
    '/:id', 
    [
        //validarJWT,
        tieneRole('ADMIN_ROLE'),
        check('id','El id no es valido').isMongoId(),
        check('id').custom( existCategoria ),
        validarCampos
    ],
    actualizarCategoria
);

//Borrar categoria - privado
router.delete('/:id', 
[
    //validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','El id no es valido').isMongoId(),
    check('id').custom( existCategoria ),
    validarCampos
],
    borrarCategoria
);

module.exports = router;