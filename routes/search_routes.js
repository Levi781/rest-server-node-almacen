const { Router } = require('express');
const { searchProducts } = require('../controllers/search_controller');

const router = Router();

router.get('/:coleccion/:termino', searchProducts);

module.exports = router;