import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MapView, { Polyline, ProviderPropType } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let lineId = 0;

class PolylineCreator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polylines: [],
      LineEditing: null,
    };
  }

  finish() {
    const { polylines, LineEditing } = this.state;
    this.setState({
      polylines: [...polylines, LineEditing],
      LineEditing: null,
    });
  }

  onPanDrag(e) {
    const { LineEditing } = this.state;
    if (!LineEditing) {
      this.setState({
        LineEditing: {
          lineId: lineId++,
          coordinates: [e.nativeEvent.coordinate],
        },
      });
    } else {
      this.setState({
        LineEditing: {
          ...LineEditing,
          coordinates: [...LineEditing.coordinates, e.nativeEvent.coordinate],
        },
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
          scrollEnabled={false}
          onPanDrag={e => this.onPanDrag(e)}
        >


          {this.state.polylines.map(polyline => (
            <Polyline
              key={polyline.lineId}
              coordinates={polyline.coordinates}
              strokeColor="#000"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          ))}

          {this.state.LineEditing && (
            <Polyline
              key="editingPolyline"
              coordinates={this.state.LineEditing.coordinates}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          )}


          
        </MapView>



        <View style={styles.buttonContainer}>
          {this.state.LineEditing && (
            <TouchableOpacity
              onPress={() => this.finish()}
              style={[styles.bubble, styles.button]}
            >
              <Text>Finish</Text>
            </TouchableOpacity>
          )}
        </View>



      </View>
    );
  }
}

PolylineCreator.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default PolylineCreator;