const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //specifies that we use the buil-in promises, not a library
mongoose.connect('mongodb://localhost:27017/ToDoApp');

module.exports = {mongoose};