import React from'react'
import {View, Text, Button, StyleSheet, SafeAreaView} from 'react-native'

import  WebMapView  from '../arcGigAPI/MapView'
import { TouchableOpacity } from 'react-native-gesture-handler';

class Browser extends React.Component {
constructor(props) {
    super(props)
    this.state = {
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
        <View style={styles.main}>
            <WebMapView mapType={this.state.mapType} style={styles.map}></WebMapView>
            <View  style={styles.LayoutButtons}>
                <TouchableOpacity onPress={this._changeLocation} style={styles.MapType}><Text>sat</Text></TouchableOpacity>
            </View>
            <View style={styles.DrawingButtons}>
                <TouchableOpacity style={styles.MapType}><Text>Mrk</Text></TouchableOpacity>
                <TouchableOpacity style={styles.MapType}><Text>Lne</Text></TouchableOpacity>
                <TouchableOpacity style={styles.MapType}><Text>Plg</Text></TouchableOpacity>
            </View>
        </View>
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
        top : 150,
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
        backgroundColor : "red",
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

export default Browser
