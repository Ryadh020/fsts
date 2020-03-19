import React from'react'
import {View, Text, Button, StyleSheet, SafeAreaView, Image} from 'react-native'
import { MAP_TYPES } from 'react-native-maps';

import  WebMapView  from '../../googleMapAPI/MapView'
import { TouchableOpacity } from 'react-native-gesture-handler';

class Browser extends React.Component {
constructor(props) {
    super(props)
    this.state = {
      mapType : MAP_TYPES.STANDARD
    }
    this._changeMapType = this._changeMapType.bind(this)
}

    // the setting function
    _changeMapType() {
        this.setState({ mapType : MAP_TYPES.SATELLITE });
      }

render() {
    return (
        <View style={styles.main}>
            <WebMapView mapType={this.state.mapType} style={styles.map}></WebMapView>
            <View  style={styles.LayoutButtons}>
                <TouchableOpacity onPress={this._changeMapType} style={styles.MapType}>
                <Image style={{width: 45, height: 45}} source={require("../../Images/earth.png")} />
                </TouchableOpacity>
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

export default Browser
