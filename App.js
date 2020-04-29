import * as React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native'
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import Route from './Navigation/Route'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      no : 1,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({no: 2})
    }, 4000);
  }

render() {
  return (
    this.state.no === 1 ? 
    <View style={styles.introPage}>

      <Image 
        source={require("./Images/logo.png")} 
        style={{width: 200, height: 200}}
      />


      <View style={styles.touche}>
        <Text style={{color: "white"}}>Made with </Text>
        <Image
          style={{width: 20, height:20}}
          source={require("./Images/love.png")}
        ></Image>
        <Text style={{color: "white"}}> and </Text>
        <Image
          style={{width: 25, height:25}}
          source={require("./Images/milk.png")}
        ></Image>
      </View>


    </View>
    :
    <Provider store={Store}>
      <Route></Route>
    </Provider>
  )
}

}

const styles = StyleSheet.create({
  introPage: {
    display:"flex",
    flex: 1,
    justifyContent:"flex-end", 
    alignItems: "center",
    backgroundColor: "black"
  },
  touche: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    height: "45%",
    marginBottom: 20,
  }
})

