const connectToMongo = require("./db");
const express = require("express");

require('dotenv').config()

// connecting to the mongoDB
connectToMongo();

const app = express();

// adding middleware to use json
app.use(express.json());

// Available Routes
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/post'));
app.use('/api', require('./routes/follow'));


// listening at PORT
app.listen(process.env.PORT, () => {
    console.log(`App listening at http://localhost:${process.env.PORT}`);
})