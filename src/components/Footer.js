'use strict';

import React, { Component } from 'react';
import { Footer as NativeFooter, FooterTab, Button, Text, Icon } from 'native-base';

import {
  StyleSheet,
  View,
} from 'react-native';

class Footer extends Component {
  render() {
    return (
      <NativeFooter>
				<FooterTab>
					<Button active>
						<Icon name='navigate' />
					</Button>
				</FooterTab>
    </NativeFooter>
    );
  }
}

const styles = StyleSheet.create({

});


export default Footer;
