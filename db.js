const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://Kumar:Kumar12345@kumartm.uu9bbhr.mongodb.net/reunion?retryWrites=true&w=majority"

// Create mongo connection
const connectToMongo = () => {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true
  })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
};

module.exports = connectToMongo;