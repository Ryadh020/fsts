import React from 'react'
import {Image} from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'react-native-elements'

import Browser from './Pages/Browser'
import MyMaps from './Pages/MyMaps'

  const TabNavigator = createMaterialBottomTabNavigator({
    Browser: {
      screen :Browser,

      navigationOptions:{
        tabBarIcon: ({focused}) =><Icon name="place" size={30} color={focused ? '#FFF' : 'rgba(250,250,250,0.5)'}/>,
      }
    },

    myMaps: {
      screen :MyMaps,

      navigationOptions:{
        tabBarIcon: ({focused}) =><Icon name="assistant" size={30} color={focused ? '#FFF' : 'rgba(250,250,250,0.5)'}/>,
      }
    },
  },
  {
    initialRouteName: 'Browser',
    activeColor: 'rgba(250,250,250,0.5)',
    inactiveColor: 'rgba(250,250,250,0.5)',
    barStyle: { backgroundColor: 'rgba(0,0,0,1)' },

    shifting: false,
    labeled: false,
  }
  );


export default createAppContainer(TabNavigator);