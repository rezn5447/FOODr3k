/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import App from './components/app';
import { Examples } from '@shoutem/ui';

export default class FOODr3k extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('FOODr3k', () => FOODr3k);
