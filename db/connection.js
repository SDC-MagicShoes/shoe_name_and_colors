const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/nikeFEC_n&c';

const db = mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true });
db.catch((err) => {
  console.log(err);
}).then(() => {
  console.log('>>>>> Connected to MongoDB...');
});

module.exports = db;
