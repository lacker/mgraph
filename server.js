const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dev');

const prebuilt = require('mongodb-prebuilt');

// Set up the database.
// In a real production environment you wouldn't want your application
// server to start your database process like this.
prebuilt.start_server(null, (errorCode) => {
  console.log('start_server got error code', errorCode);
});

const Todo = mongoose.model('Todo', {
  text: String,
  completed: Boolean,
});
