var mongoose = require('mongoose');

switch(process.env.NODE_ENV) {
  case 'test':
    mongoose.connect('mongodb://localhost/playolatest', function() {
      console.log('mongodb connected, using test db');
    });

  default:
    mongoose.connect('mongodb://localhost/playoladevelopment', function() {
      console.log('mongodb connected, using development db');
    });
}

module.exports = mongoose;