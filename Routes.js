import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {MainScreen, AddMealScreen} from './src/components';

// Screens and their routes
const navigator = createStackNavigator(
  {
    MainScreen: MainScreen,
    AddMealScreen: AddMealScreen,
  },
  {
    initialRouteName: 'MainScreen',
    defaultNavigationOptions: {
      title: 'Calories Tracker',
      header: null,
    },
  },
  {
    navigationOptions: {
      header: null,
    },
  },
);

export default createAppContainer(navigator);
