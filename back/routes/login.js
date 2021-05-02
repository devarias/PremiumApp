const { Router } = require('express');
const { login } = require('../controllers/login.controller');

const router = Router();

router.get('/', login);

module.exports = router;
