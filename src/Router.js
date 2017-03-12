import React from 'react';
import { Image, View } from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import GoogleMap from './components/GoogleMap';

const RouterComponent = () => {
	return (
		<Router sceneStyle={{ paddingTop: 65, flexGrow: 1 }} >
			<Scene key="auth">
				<Scene 
				key="GoogleMap" 
				component={GoogleMap} 
				title="Fooder3k"
				/>
			</Scene>
		</Router>
	);
};

export default RouterComponent;
