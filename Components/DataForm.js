import React from "react"
import {View, Text, StyleSheet, Dimensions} from "react-native"

class Data extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render() {
      return(
          <View style={styles.table}>
            <Text>dfdfdff</Text>
          </View>
      )
    }
}

const styles = StyleSheet.create({
  table: {
    position: "absolute",
    top: (Dimensions.get('window').height) * 0.5,
    left: (Dimensions.get('window').height) * 0.025,
    width: (Dimensions.get('window').width) * 0.9,
    height: (Dimensions.get('window').height) * 0.4,

    backgroundColor: "red",
  }
})

export default Data