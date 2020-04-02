import React from'react'
import {View, Text, Button, StyleSheet, SafeAreaView, Image} from 'react-native'
import { MAP_TYPES } from 'react-native-maps';
import { AsyncStorage } from 'react-native';

import SavedMap from '../../googleMapAPI/SavedMap'

import { TouchableOpacity } from 'react-native-gesture-handler';

class MyMaps extends React.Component {
constructor(props) {
    super(props)
    this.state = {
      mapType: MAP_TYPES.STANDARD,
      currentMap: 1,

      Storage: [
        {
          latiLngi : {latitude: 0, longitude: 0},
          
        }
      ]
    }
    this._changeMapType = this._changeMapType.bind(this)
}

    // the setting function
    _changeMapType() {
        this.setState({ mapType : MAP_TYPES.SATELLITE });
    }


    _getData =  async () => { 
        
        try {
          const value = await AsyncStorage.getItem('savedMap');
          if (value !== null) {
            // We have data!!
            console.log("data retrived: " + value)
            
            
            //let data = JSON.parse(value)    // parse data string


            this.setState({Storage : JSON.parse(value) })
            
          }
        } catch (error) {
          // Error retrieving data
          console.log("Error retrieving data")
        }
    }
    
    


render() {
    return (
        <SafeAreaView style={styles.main}>
            <SavedMap mapType={this.state.mapType} style={styles.map} data={this.state.Storage /*[this.state.currentMap]*/}></SavedMap>


            

            <View  style={styles.LayoutButtons}>
                <TouchableOpacity onPress={this._changeMapType} style={styles.MapType}>
                <Image style={{width: 45, height: 45}} source={require("../../Images/earth.png")} />
                </TouchableOpacity>

 

                <TouchableOpacity onPress={() => this._getData()} style={styles.MapType}>
                  <Image 
                    source={require("../../Images/done.png")} 
                    style={{width: 25, height: 25}}
                  />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}
}

const styles = StyleSheet.create({
    main : {
        flex : 1,
        justifyContent : 'flex-end',
        alignItems : 'center'
    },
    LayoutButtons : {  // for the left side buttons (sattelite/map ....etc.)
        position : "absolute",
        top : "25%",
        left : 15,
        display : "flex",
        flexDirection : "column",
        justifyContent : "center",
        alignItems : "center",
    },
    MapType : { // ordinary button
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        width : 45,
        height : 45,
        padding : 5,
        backgroundColor : "hsla(44, 0%, 85%, 0.5)",
        borderRadius : 50
    },
    DrawingButtons : {  // for the right side buttons (marker/line/Polygone ....etc.)
        position : "absolute",
        top : 150,
        right : 15,
        display : "flex",
        flexDirection : "column",
        justifyContent : "space-around",
        alignItems : "center"
    }
})

export default MyMaps