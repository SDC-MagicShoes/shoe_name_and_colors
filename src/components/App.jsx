import React from 'react';
import PropTypes from 'prop-types';
import 'regenerator-runtime/runtime';

import Name from './Name';
import ColorsGrid from './ColorsGrid';

const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.changeShoe = this.changeShoe.bind(this);
    this.state = {
      shoeID: props.shoeID,
      name: 'MagicShoes',
      colors: [],
      price: '$200',
      shoeType: "Men's Shoe",
    };
    console.log(props.shoeID);
  }

  componentDidMount() {
    const { shoeID } = this.state;
    this.findShoeInformation(shoeID);
  }

  changeShoe(shoeID) {
    this.findShoeInformation(shoeID);
  }

  async findShoeInformation(shoeID) {
    let info = await axios.get(`/${shoeID}/colors`);
    [info] = info.data;
    const newState = {};
    newState.shoeID = info.shoeID;
    newState.name = info.shoeName.split('_').join(' ');
    newState.colors = info.shoeColors;
    newState.price = info.price;
    newState.shoeType = info.shoeLine;
    this.setState(newState);
  }

  render() {
    const {
      name, colors, shoeID, price, shoeType,
    } = this.state;
    return (
      <div className="module">
        <div className="shoeType">{shoeType}</div>
        <div className="price">{price}</div>
        <Name name={name} shoeID={shoeID} />
        <div className="color_grid">
          <ColorsGrid ids={colors} changeShoe={this.changeShoe} curShoe={shoeID} />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  shoeID: PropTypes.string,
};

App.defaultProps = {
  shoeID: '310805-408',
};

export default App;
