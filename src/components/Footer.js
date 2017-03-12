'use strict';

import React, { Component } from 'react';
import { Footer as NativeFooter, FooterTab, Button, Text, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';

import {
  StyleSheet,
  View,
} from 'react-native';

class Footer extends Component {
	onNavPress() {
		console.log('Pressed the nav')
	}
	onDetailPress() {
		Actions.detail();
	}
	
  render() {
    return (
      <NativeFooter>
				<FooterTab>
					<Button active onPress={() => this.onNavPress()}>
						<Icon name='navigate' />
					</Button>
					<Button onPress={() => this.onDetailPress()}>
						<Icon name='restaurant' />
					</Button>
				</FooterTab>
    </NativeFooter>
    );
  }
}

const styles = StyleSheet.create({

});


export default Footer;
