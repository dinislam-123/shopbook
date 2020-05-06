/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Homepage from './src/components/homepage';
// import TestDate from './src/components/TestDate';

AppRegistry.registerComponent(appName, () => Homepage);
