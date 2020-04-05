import React from'react'
import {View, Text, Button, StyleSheet, SafeAreaView, Image} from 'react-native'

import SavedMap from '../../googleMapAPI/SavedMap'

class MyMaps extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.main}>
                <SavedMap style={styles.map}></SavedMap>
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