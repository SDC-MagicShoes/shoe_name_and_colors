require('newrelic');
const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

// const Shoe = require('../db/shoeTitle');

const app = express();

const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  database: 'magicshoes',
  port: 5432, // this is the default port number for pg
});

// pool.query('SELECT * FROM colors WHERE colors.shoeId=1', (err, res) => {
//   console.log(err, res);
// });

app.use(express.static(path.join(__dirname, '../public')));

app.use(morgan('dev'));
app.use(parser.json());
app.use(compression());

// SHOE: [ { shoeColors: [ '820276-006' ],
//     _id: 5beb6fbf9ab5a06c455fbc20,
//     shoeID: '820276-006',
//     shoeName: 'Jordan Jumpman Quick 23',
//     price: '$149',
//     shoeLine: 'Men\'s Shoe',
//     shoeType: '820276',
//     image: 'https://s3.amazonaws.com/warp-v/images/AA1272_014.jpeg',
//     __v: 0 } ]

// SERVER REQUEST METHODS
app.get('/:shoeID/colors', ({ params }, res) => {
  // const id = params.shoeID;
  const id = Math.floor((Math.random() * 10 * 1000 * 1000) + 1);
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
    res.send(reply);
  });

  // Shoe.find({ shoeID: id }, (err, shoe) => {
  //   if (err) {
  //     console.log(err);
  //     res.end();
  //   } else {
  //     console.log('SHOE', shoe);
  //     res.send(shoe);
  //   }
  // });
});

app.get('/:shoeID/colors/:style', ({ params }, res) => {
  const { shoeID } = params;
  const images = [];
  pool.query(`SELECT * FROM colors where colors.shoeId=${shoeID}`, (err, data) => {
    if (err) { console.log(err); }
    for (let i = 0; i < data.rows.length; i += 1) {
      const tuple = [];
      tuple.push(shoeID);
      tuple.push(data.rows[i].url);
      console.log('TUPLE', tuple);
      images.push(tuple);
    }
    res.send(images);
  });

  // Shoe.find({ shoeType: style }, (err, shoes) => {
  //   if (err) {
  //     console.log(err);
  //     res.end();
  //   } else {
  //     const images = [];
  //     for (let i = 0; i < shoes.length; i += 1) {
  //       const tuple = [];
  //       tuple.push(shoes[i].shoeID);
  //       tuple.push(shoes[i].image);
  //       images.push(tuple);
  //     }
  //     console.log(images);
  //     res.send(images);
  //   }
  // });
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
