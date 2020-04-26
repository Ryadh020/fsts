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
    activeColor: 'rgba(250,250,250,0.5)',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: 'rgba(0,0,0,1)' },
  }
  );


export default createAppContainer(TabNavigator);