const express = require('express');

const parser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

const Shoe = require('../db/shoeTitle');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.use(morgan('dev'));
app.use(parser.json());
app.use(compression());

// SERVER REQUEST METHODS
app.get('/:shoeID/colors', ({ params }, res) => {
  const id = params.shoeID;
  Shoe.find({ shoeID: id }, (err, shoe) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      res.send(shoe);
    }
  });
});

app.get('/:shoeID/colors/:style', ({ params }, res) => {
  const { style } = params;
  Shoe.find({ shoeType: style }, (err, shoes) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      const images = [];
      for (let i = 0; i < shoes.length; i += 1) {
        const tuple = [];
        tuple.push(shoes[i].shoeID);
        tuple.push(shoes[i].image);
        images.push(tuple);
      }
      res.send(images);
    }
  });
});


app.post('/new/shoe', (req, res) => {
  // shoeID: { type: String, unique: true },
  // shoeName: String,
  // shoeColors: [String],
  // price: String,
  // shoeLine: String,
  // image: String,
  // shoeType: String,
  const newShoe = req.body;
  Shoe.create(newShoe, (err) => { throw err; });
  res.status(200).send('added!');
});

app.delete('/:shoeId/delete', ({ params }, res) => {
  const deleteShoe = { shoeId: params.shoeId };
  Shoe.deleteOne(deleteShoe, (err) => { throw err; });
  res.status(200).send('deleted!');
});

app.patch('/:shoeId/update', ({ params }, res) => {
  const updateShoe = { shoeId: params.shoeId };
  Shoe.updateOne({ shoeId: updateShoe }, (err) => { throw err; });
  res.status(200).send('updated!');
});

// APP LISTENING PROTOCOL
const PORT = 3006;
app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(`>>>>> Express server listening on port ${PORT}...`);
});
