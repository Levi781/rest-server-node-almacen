const { Router } = require('express');
const { postRegisterInput, putRegisterInput, deleteRegisterInput, getRegisterInput } = require('../controllers/inputs_controller');

const router = Router();

router.get('/', getRegisterInput);
router.post('/', postRegisterInput);
router.put('/:id', putRegisterInput);
router.delete('/', deleteRegisterInput);

module.exports = router;