/***********************************
 * This app.js file is the primary file of the
 * application.
**********************************/

/***********************************
 * Require Statements
 * ********************************/
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();


/********************
 * Routes
 ********************/
app.get('/', (req, res) => {
    res.send('Hello world');
});

/***********************************
 * Server Listener
 * ********************************/
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;