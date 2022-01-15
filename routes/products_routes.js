const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, obtenerTodosProductos, obtenerProducto, actualizarProducto, borrarProducto, obtenerSiProductos, obtenerNoProductos } = require('../controllers/products_controller');
const { existCategoria, existProducto, existUserId, isAdminUser } = require('../helpers/db_validator');
const { validarJWT, validarCampos, esAdminRole, tieneRole } = require('../middlewares');

const router = Router();

// //Obtener todos los productos - paginado
router.get('/', obtenerTodosProductos);
router.get('/not', obtenerNoProductos);
router.get('/available', obtenerSiProductos);

// //Obtener un producto por id
router.get('/:id',[
    check('id', 'El id debe ser valido').isMongoId(),
    check('id').custom( existProducto ),
    validarCampos
], obtenerProducto);

//Crear producto
router.post('/',
    
    [
        //validarJWT,
        check('idc','No es un id valido').isMongoId(),
        check('idc').custom( existCategoria ),
        check('name', 'El producto debe tener un nombre').not().isEmpty(),
        validarCampos
    ]

, crearProducto);

// //Actualizar
 router.put('/:id',
    [
        //validarJWT,
        //tieneRole('ADMIN_ROLE'),
        check('id', 'El id debe ser valido').isMongoId(),
        check('id').custom( existProducto ),
        validarCampos   
    ], 
    actualizarProducto );

// //Borrar
router.delete('/:id/:idu',
    [
        //validarJWT,
        check('id', 'El id debe ser valido').isMongoId(),
        check('idu', 'El id debe ser valido').isMongoId(),
        check('id').custom( existProducto ),
        check('idu').custom( existUserId ),
        check('idu').custom( isAdminUser ),
        validarCampos   
    ],  borrarProducto );


module.exports = router;