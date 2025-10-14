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
const productRouter = require('./routes/productRouter')
const orderRouter = require('./routes/orderRouter')

/********************
 * Middleware
********************/
app.use(express.json());

/********************
 * GET Routes
********************/
app.get('/', (req, res) => {
    res.send('Hello world');
});

app.use('/product', productRouter);

app.use('/order', orderRouter);


/***********************************
 * Server Listener
************************************/
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;