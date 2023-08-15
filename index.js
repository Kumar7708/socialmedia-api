const connectToMongo = require("./db");
const express = require("express");

require('dotenv').config()

connectToMongo();

const app = express();
app.use(express.json());

// Available Routes
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/post'));
app.use('/api', require('./routes/follow'));



app.listen(process.env.PORT, () => {
    console.log(`App listening at http://localhost:${process.env.PORT}`);
})