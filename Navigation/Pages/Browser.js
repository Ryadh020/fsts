import React from'react'
import {View, Text, Button, StyleSheet, SafeAreaView, Image} from 'react-native'
import  WebMapView  from '../../googleMapAPI/MapView'
import { TouchableOpacity } from 'react-native-gesture-handler';

class Browser extends React.Component {
constructor(props) {
    super(props)
    this.state = {}
}

render() {
    return (
        <View style={styles.main}>
            <WebMapView style={styles.map}></WebMapView>
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
