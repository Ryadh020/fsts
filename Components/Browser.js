import React from'react'
import {View, Text, Button, StyleSheet, SafeAreaView} from 'react-native'

import  WebMapView  from '../arcGigAPI/MapView'

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
            <Button onPress={this._changeLocation} title='satellite' style={styles.Button}></Button>
        </View>
    )
}
}

const styles = StyleSheet.create({
    main : {
        flex : 1,
        justifyContent : 'flex-end',
        alignItems : 'center'
    }
})

export default Browser
