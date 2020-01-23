import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
//import { Button } from 'react-native-paper';

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      region : {
        latitude: 36.365,
        longitude: 6.61472,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      mapType : "standart"
    }
    this._changeLocation = this._changeLocation.bind(this)
  }

    // the setting function
  _changeLocation() {
    this.setState({ mapType : "satellite" });
  }


  render() {
    return (
      <View style={styles.container}>
        <MapView 
          mapType = {this.state.mapType}
          initialRegion = {this.constantine}
          region = {this.state.region}
          style={styles.mapStyle} 
        />
        <Button onPress={this._changeLocation} title='satellite'>
          
        </Button>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height) * 0.89,
  },
  button : {
    position : "absolute",
    //top : 150,
  },
  text : {
    //position : "absolute",
    backgroundColor : "red"
  }
});
