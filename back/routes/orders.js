const { Router } = require('express');
const {
  ordersList,
  getOrder,
  createOrder,
} = require('../controllers/orders.controller');

const router = Router();

router.get('/all', ordersList);
router.get('/:id', getOrder);
router.post('/', createOrder);

module.exports = router;
