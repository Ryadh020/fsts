import React from'react'
import {View, Text, Button, StyleSheet, SafeAreaView} from 'react-native'

class Browser extends React.Component {
constructor(props) {
    super(props)
    this.state = {

    }
}

render() {
    return (
        <View style={styles.main}>
            <Button title="TEST"
                    style={styles.elements} >
            </Button>
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

            //Just for testing
        borderColor: 'red',
        borderWidth: 1
    },
    elements : {
        width: 105,
        height: 45,

            //Just for testing
        borderColor: 'red',
        borderWidth: 1
    }
})

export default Browser
