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
          coordinate={this.props.cords}
          title={"Marker"}
          description={"oued rhumel"}
        ></Marker>
      )
  }
}

export default MarkerCreator;