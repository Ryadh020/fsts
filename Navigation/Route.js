import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import Browser from './Pages/Browser'
import MyMaps from './Pages/MyMaps'

  const TabNavigator = createMaterialBottomTabNavigator({
    Browser: {
      screen :Browser,
    },
    myMaps: {
      screen :MyMaps
    },
  },
  {
    initialRouteName: 'Browser',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#694fad' },
  }
  );


export default createAppContainer(TabNavigator);