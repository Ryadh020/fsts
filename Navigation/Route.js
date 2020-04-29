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
        tabBarIcon: () => <Image source={require("../Images/BottomNavBar/browse.png")} style={{width: 30, height: 30}}/>,
        tabBarLabel: "Browse",

      }
    },

    myMaps: {
      screen :MyMaps,
      navigationOptions:{
        tabBarIcon: () =><Image source={require("../Images/BottomNavBar/saved.png")} style={{width: 30, height: 30}}/>,
        tabBarLabel: "Saved",
      }
    },
  },
  {
    initialRouteName: 'Browser',
    activeColor: 'rgba(250,250,250,1)',
    inactiveColor: 'rgba(250,250,250,0.5)',
    barStyle: { backgroundColor: '#616262' },
  }
  );


export default createAppContainer(TabNavigator);