/*
import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';

import Browser from '../Components/Browser'
import MyMaps from '../Components/MyMaps'

const BottomNavigationTab = createBottomTabNavigator({
  search : {
      screen : Browser,
      navigationOptions : {
          tabBarIcon : () => {
              return (
                  <Image
                      source={require("../Images/ic_search.png")}
                      style={styles.icon}
                  />
              )
          }
      }
  },
  favorites : {
      screen : MyMaps,
      navigationOptions : {
          tabBarIcon : () => {
              return (
                  <Image
                      source={require('../Images/ic_favorite.png')}
                      style={styles.icon}
                  />
              )
          }
      },
  },
},
{
  tabBarOptions : {
      showLabel : false,
      showIcon : true,
      activeBackgroundColor : 'white',
      inactiveBackgroundColor : 'white',
  }
}
)

const styles = StyleSheet.create({
  icon : {
      width : 30,
      height : 30
  }
})

export default createAppContainer(BottomNavigationTab);
*/
import React from 'react'
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import Browser from '../Components/Browser'
import MyMaps from '../Components/MyMaps'

  const TabNavigator = createMaterialBottomTabNavigator({
    Home: Browser,
    Settings: MyMaps,
  });


export default createAppContainer(TabNavigator);