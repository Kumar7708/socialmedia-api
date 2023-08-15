const mongoose = require('mongoose');

// Create mongo connection
const connectToMongo = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
};

module.exports = connectToMongo;