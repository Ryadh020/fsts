import React from'react'
import {View, Text, Button, StyleSheet, SafeAreaView} from 'react-native'

import  WebMapView  from '../arcGigAPI/MapView'

class Browser extends React.Component {
constructor(props) {
    super(props)
    this.state = {
        ////
    }
}

render() {
    return (
        <View style={styles.main}>
            <WebMapView></WebMapView>
        </View>
    )
}
}

const styles = StyleSheet.create({
    main : {
        width: '100%',
        height: '100%',

        display: 'flex',
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    }
})

export default Browser
