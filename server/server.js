require('newrelic');
const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const redis = require('redis');
const dbAddress = require('../dbAddress');
const redisAddress = require('../redisAddress');

const app = express();

const { Pool } = require('pg');

const pool = new Pool({
  host: `${dbAddress}`,
  user: 'postgres',
  password: 'test',
  database: 'magicshoes',
  port: 5432, // this is the default port number for pg
});

const client = redis.createClient({
  host: `${redisAddress}`,
  port: 6379,
});

client.on('error', (err) => {
  console.log("Error " + err);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.use(morgan('dev'));
app.use(parser.json());
app.use(compression());

app.use('/loaderio-bdb53f82a91fa1b5696f4c471970468a.txt', express.static('loaderio-bdb53f82a91fa1b5696f4c471970468a.txt'));

// SERVER REQUEST METHODS
const probability = [1, 1, 1, 1, 0]; // 80% chance of being 1;
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
app.get('/:shoeID/colors', ({ params }, res) => {
  // const id = params.shoeID;
  let id = Math.floor((Math.random() * 10 * 1000 * 1000) + 1);
  const chance = probability[Math.floor(Math.random() * probability.length)];
  if (chance === 1) {
    id = getRandomIntInclusive(9 * 1000 * 1000, 10 * 1000 * 1000);
  }

  return client.get(`shoes:${id}`, (err, redisResult) => {
    if (redisResult) {
      const resultJSON = JSON.parse(redisResult);
      console.log('REDIS', resultJSON);
      res.status(200).json(resultJSON);
    } else {
      pool.query(`SELECT * FROM shoes WHERE shoes.shoeId=${id}`, (err, data) => {
        if (err) { console.log(err); }
        const reply = [{
          shoeColors: ['820276-006'],
          shoeName: data.rows[0].shoename,
          shoeID: data.rows[0].shoeid,
          shoeLine: data.rows[0].shoeline,
          price: data.rows[0].price,
          shoeType: '820276',
          image: 'https://s3.amazonaws.com/warp-v/images/AA1272_014.jpeg',
        }];
        client.setex(`shoes:${id}`, 3600, JSON.stringify(reply));
        res.send(reply);
      });
    }
  });
});

app.get('/:shoeID/colors/:style', ({ params }, res) => {
  const { shoeID } = params;
  const images = [];

  return client.get(`colors:${shoeID}`, (err, redisResult) => {
    if (redisResult) {
      const resultJSON = JSON.parse(redisResult);
      console.log('REDIS', resultJSON);
      res.status(200).json(resultJSON);
    } else {
      pool.query(`SELECT * FROM colors where colors.shoeId=${shoeID}`, (err, data) => {
        if (err) { console.log(err); }
        for (let i = 0; i < data.rows.length; i += 1) {
          const tuple = [];
          tuple.push(shoeID);
          tuple.push(data.rows[i].url);
          images.push(tuple);
        }
        client.setex(`colors:${shoeID}`, 3600, JSON.stringify(images));
        res.send(images);
      });
    }
  });
});


// app.post('/new/shoe', (req, res) => {
//   // shoeID: { type: String, unique: true },
//   // shoeName: String,
//   // shoeColors: [String],
//   // price: String,
//   // shoeLine: String,
//   // image: String,
//   // shoeType: String,
//   const newShoe = req.body;
//   Shoe.create(newShoe, (err) => { throw err; });
//   res.status(200).send('added!');
// });

// app.delete('/:shoeId/delete', ({ params }, res) => {
//   const deleteShoe = { shoeId: params.shoeId };
//   Shoe.deleteOne(deleteShoe, (err) => { throw err; });
//   res.status(200).send('deleted!');
// });

// app.patch('/:shoeId/update', ({ params }, res) => {
//   const updateShoe = { shoeId: params.shoeId };
//   Shoe.updateOne({ shoeId: updateShoe }, (err) => { throw err; });
//   res.status(200).send('updated!');
// });

// APP LISTENING PROTOCOL
const PORT = 3006;
app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(`>>>>> Express server listening on port ${PORT}...`);
});
