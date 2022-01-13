const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares')

const { 
    esRolValido, 
    emailExiste,
    existUserId 
} = require('../helpers/db_validator');

const { 
    usuariosGet, 
    usuariosPut, 
    usuariosDelete, 
    usuariosPost, 
    usuariosPatch, 
    usuariosGetbyId
} = require('../controllers/users_controllers');


const router = Router();

router.get('/', usuariosGet );

router.get('/:id',[
    check('id','Debe ser un id de mongo valido').isMongoId()
], usuariosGetbyId );

router.put(
    '/:id',
    [
        check('id', 'No es un id Valido').isMongoId(),
        check('id').custom( existUserId ),
        check('role').custom( esRolValido ),//otra validacion personalizada
        validarCampos
    ], 
    usuariosPut
    );

router.post(
    
    '/', 

    [
    check( 'email', 'El correo no es valido' ).isEmail(), //middleware, captura los errores en el request
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(), //middleware, captura los errores en el request
    check( 'password', 'El password debe ser mayor a 6 letras' ).isLength({min: 6}), //middleware, captura los errores en el request
    //check( 'role', 'No es un rol permitido' ).isIn(['ADMIN_ROLE', 'USER_ROLE']), //middleware, captura los errores en el request
    //check personalizado, el throw carga el error al request, es lo mismo
    check('email').custom( emailExiste ),//otra validacion personalizada
    check('role').custom( esRolValido ),//otra validacion personalizada
    validarCampos   
    ] , 
    
    usuariosPost);

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un id Valido').isMongoId(),
    check('id').custom( existUserId ),
    validarCampos
], usuariosDelete);



router.patch('/', usuariosPatch);


module.exports = router;








