import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, { MAP_TYPES } from 'react-native-maps';
const { width, height } = Dimensions.get('window');

// Github HQ:
// lat: 37.782227,
// lng: -122.391050

const ASPECT_RATIO = width / height;
const LATITUDE = 37.782227;
const LONGITUDE = -122.391050;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class App extends Component {

}