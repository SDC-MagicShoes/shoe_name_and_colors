const Faker = require('faker');
const fs = require('fs');

// const shoeTitleSchema = new mongoose.Schema({
//   shoeID: { type: String, unique: true },
//   shoeName: String,
//   shoeLine: String,
//   price: String,
//   colors: [Array],
// });

// const Shoe = mongoose.model('ShoeInfo', shoeTitleSchema);

const SHOELINE = ['Men\'s Shoe', 'Women\'s Shoe', 'Men\'s Basketball Shoe', 'Women\'s Basketball Shoe'];
const NUMSHOESTOSEED = 10 * 1000 * 1000; // 10 million

const generateColorsArrays = (maxNumColors) => {
  const colors = [];
  const numColors = Math.floor(Math.random() * maxNumColors) + 1;
  for (let i = 0; i < numColors; i += 1) {
    const randomColor = Faker.commerce.color();
    const randomPictureIndex = Math.floor(Math.random() * 1000) + 1;
    colors.push([randomColor, `https://s3-us-west-1.amazonaws.com/magicshoes/images/${randomPictureIndex}.jpg`]);
  }
  return colors;
};

const file = fs.createWriteStream('./shoes.json');
let i = 1;

const seedEverything = () => {
  const createAllShoes = (numShoes, callback) => {
    // file.write('[');

    while (i <= numShoes) {
      const generatedColors = generateColorsArrays(5);
      const newShoe = {
        shoeID: i.toString(),
        shoeName: `MagicShoes_${i}`,
        price: `$${Math.floor(Math.random() * 100) + 100}`,
        shoeLine: SHOELINE[(Math.floor(Math.random() * SHOELINE.length))],
        colors: generatedColors,
      };

      i += 1;
      let string;
      if (i !== (NUMSHOESTOSEED + 1)) {
        string = JSON.stringify(newShoe) + '\n';
      } else {
        string = JSON.stringify(newShoe);
      }

      if (!file.write(string)) {
        // write returns a boolean that returns false if you ever go over memory
        return;
      }
    }

    // if (i === (NUMSHOESTOSEED + 1)) {
    //   console.log('hello');
    //   file.write(']');
    // }

    file.end();
    callback();
  };

  file.on('drain', () => {
    createAllShoes(NUMSHOESTOSEED, () => {
      console.log('done');
    });
  });

  createAllShoes(NUMSHOESTOSEED, () => {
    console.log('done');
  });
};

seedEverything();
