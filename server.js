const fs = require('fs');

const mongoose = require('mongoose');
const prebuilt = require('mongodb-prebuilt');

if (!fs.existsSync('/data/db')) {
  console.log('You need to create the mongodb data directory:');
  console.log('  sudo mkdir -m 777 /data/db');
  process.exit(1);
}

// Set up the database.
// In a real production environment you wouldn't want your application
// server to start your database process like this.
prebuilt.start_server(null, (errorCode) => {
  console.log('start_server failed with error code', errorCode);
});

mongoose.connect('mongodb://localhost:27017/dev');

const config = {
  Todo: {
    text: String,
    completed: Boolean,
  },
};

for (let key in config) {
  let model = mongoose.model(key, config.key);
}

const Todo = config.Todo;
