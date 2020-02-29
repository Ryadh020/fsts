import React from 'react';
import { Marker  } from 'react-native-maps';

class MarkerCreator extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        markerNumber: 0,
      }
  }

  render() {
      return(
        <Marker
          onPress={this.props.onPress}
          coordinate={this.props.cords}
          title={"Marker"}
          description={`${this.props.data}`}
        ></Marker>
      )
  }
}

export default MarkerCreator;