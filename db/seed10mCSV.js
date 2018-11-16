const Faker = require('faker');
const fs = require('fs');

const SHOELINE = ['Men\'s Shoe', 'Women\'s Shoe', 'Men\'s Basketball Shoe', 'Women\'s Basketball Shoe'];
const NUMSHOESTOSEED = 10 * 1000 * 1000; // 10 million
const NUMCOLORSTOSEED = 3 * NUMSHOESTOSEED; // average 3 colors a shoe

const shoeFile = fs.createWriteStream('./shoes.csv');
const colorsFile = fs.createWriteStream('./colors.csv');
let i = 1;
let j = 1;

const seedEverything = () => {
  shoeFile.write('shoeId, shoeName, price, shoeLine\n');
  colorsFile.write('id, shoeId, url\n');

  const createAllShoes = (numShoes, callback) => {

    while (i <= numShoes) {
      let shoeString = '';
      shoeString += i.toString() + ',';
      shoeString += `MagicShoes_${i},`;
      shoeString += `$${Math.floor(Math.random() * 100) + 100},`;
      shoeString += SHOELINE[(Math.floor(Math.random() * SHOELINE.length))] + '\n';

      i += 1;
      if (!shoeFile.write(shoeString)) {
        // write returns a boolean that returns false if you ever go over memory
        return;
      }
    }

    shoeFile.end();
    callback();
  };

  const createAllColors = (numColors, callback) => {

    while (j <= numColors) {
      let colorString = '';
      colorString += j.toString() + ',';
      colorString += (Math.floor(Math.random() * NUMSHOESTOSEED) + 1).toString() + ',';
      const randomPictureIndex = Math.floor(Math.random() * 1000) + 1;
      colorString += `https://s3-us-west-1.amazonaws.com/magicshoes/images/${randomPictureIndex}.jpg\n`;
      j += 1;
      if (!colorsFile.write(colorString)) { return; }
    }
    colorsFile.end();
    callback();
  };

  shoeFile.on('drain', () => {
    createAllShoes(NUMSHOESTOSEED, () => {
      console.log('done seeding shoes');
    });
  });

  colorsFile.on('drain', () => {
    createAllColors(NUMCOLORSTOSEED, () => {
      console.log('done seeding colors');
    });
  });

  createAllShoes(NUMSHOESTOSEED, () => {
    console.log('done seeding shoes');
  });

  createAllColors(NUMCOLORSTOSEED, () => {
    console.log('done seeding colors');
  });
};

seedEverything();
