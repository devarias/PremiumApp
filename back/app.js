const express = require('express');
const cors = require('cors');
const loginRoute = require('./routes/login');
const ordersRoutes = require('./routes/orders');
const { json } = require('express');

const app = express();

app.use(cors());
app.use(json());

/** Routes */
app.use('/login', loginRoute);
app.use('/orders', ordersRoutes);

module.exports = app;
