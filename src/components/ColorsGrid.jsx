import React from 'react';
import PropTypes from 'prop-types';
import 'regenerator-runtime/runtime';

import ColorsRow from './ColorsRow';

const axios = require('axios');
const _ = require('lodash');

class ColorsGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      curShoe: -1,
    };
  }

  componentDidUpdate(prevProps) {
    const { ids } = this.props;
    if (ids !== prevProps.ids) {
      this.getImageLinks(ids);
    }
  }

  async getImageLinks(ids) {
    const newState = {};
    for (let i = 0; i < ids.length; i += 1) {
      const { curShoe } = this.props;
      if (ids[i] === curShoe) {
        newState.curShoe = i;
      }
    }
    const { curShoe } = this.props;
    const data = await axios.get(`/${curShoe}/colors/${ids[0].split('-')[0]}`);
    newState.images = _.chunk(data.data, 5);
    this.setState(newState);
  }

  render() {
    const { images, curShoe } = this.state;
    const { changeShoe } = this.props;
    return (
      <div className="shoe_colors_grid">
        {images.map((row, i) => <ColorsRow key={`row_${i + 1}`} changeShoe={changeShoe} curShoe={curShoe - (i * 5)} images={row} row={i.toString()} />)}
      </div>
    );
  }
}


ColorsGrid.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.string),
  curShoe: PropTypes.string,
  changeShoe: PropTypes.func,
};

ColorsGrid.defaultProps = {
  ids: ['no colors'],
  curShoe: '',
  changeShoe: () => {},
};


export default ColorsGrid;
