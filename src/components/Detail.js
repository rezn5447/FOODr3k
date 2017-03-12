'use strict';

import React, { Component } from 'react';
import axios from 'axios';

import {
  StyleSheet,
  View,
  Text
} from 'react-native';

class Detail extends Component {
	state = { restaurants: [] };
	componentWillMount() {
    axios.get('https://platform.otqa.com/sync/listings?latitude="37.782227"&longitude="-122.391050"', {
      headers: { Authorization: 'bearer 27037c67-f394-4cfd-ab51-069ac71132fb' }
    })
    .then(response => {
      this.setState({ restaurants: response.data });
      console.log(this.state.restaurants);
      this.randomRestaurant();
    });
  }
  render() {
    return (
      <Text>Detail</Text>
    );
  }
}

const styles = StyleSheet.create({

});


export default Detail;
