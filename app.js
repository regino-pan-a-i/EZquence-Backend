/***********************************
 * This app.js file is the primary file of the
 * application.
 **********************************/

/***********************************
 * Require Statements
 ************************************/
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const productRouter = require('./routes/productRouter');
const orderRouter = require('./routes/orderRouter');
const inventoryRouter = require('./routes/inventoryRouter');
const processRouter = require('./routes/processRouter');
const companyRouter = require('./routes/companyRouter');
const cors = require('cors');

/********************
 * Middleware
 ********************/
app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);
/********************
 * GET Routes
 ********************/
app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use('/product', productRouter);

app.use('/order', orderRouter);

app.use('/inventory', inventoryRouter);

app.use('/process', processRouter);

app.use('/company', companyRouter);

/***********************************
 * Server Listener
 ************************************/
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
