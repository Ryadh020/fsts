import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

class Saved extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        let {title, showSavedMap} = this.props

        return (
          <TouchableOpacity style={styles.container} onPress={()=> showSavedMap(title)}>
            <Text>{title}</Text>
            <TouchableOpacity>
              <Image 
                source={require("../Images/Manage/delete.png")} 
                style={{width: 22, height: 22}}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )
    }
}
 const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      width: 210,
      height: 45,
      padding: 15,
      margin: 5,

      backgroundColor: 'rgba(255,255,255,0.7)',
      borderRadius: 25
    }
 })


export default Saved