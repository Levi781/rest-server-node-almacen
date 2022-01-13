const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { validarCampos } = require('../middlewares/validation-fields');
const { login, googleSignIn } = require('../controllers/auth_controller');


router.post('/',[
    check('email','El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login );

router.post('/google',[
    check('id_token','El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn );


module.exports = router;