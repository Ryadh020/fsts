import React from "react"
import {View, Text, StyleSheet, Dimensions, TextInput} from "react-native"

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
            <Text>dfdfdff</Text>
            <Text>dfdfdff</Text>
            <Text>dfdfdff</Text>
            <TextInput
              style={styles.input}
              placeholder={"test"}
              enablesReturnKeyAutomatically={true}
            ></TextInput>
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    backgroundColor: "red",
    borderRadius: 20,
  },
  input: {
      width: (Dimensions.get('window').width) * 0.7,
      height:45,
      borderColor: 'gray', 
      borderWidth: 1 ,
      borderRadius: 15,
  }
})

export default Data