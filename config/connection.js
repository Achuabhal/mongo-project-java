const mongoose = require('mongoose');
const state = {
  db: null
};

module.exports.connect = async function (done) {
  const url = 'mongodb://localhost:27017/shopping';

  try {                                                            // Connect to the MongoDB database
    const connection = await mongoose.connect(url);
    state.db = connection.connection.db;
    done();
  } catch (err) {
    done(err);
  }
};

module.exports.get = function () {
  return state.db; // Return the MongoDB database connection
};
