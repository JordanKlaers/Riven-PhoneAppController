import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  AsyncStorage,
  Slider,
  Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppNavigator } from '../navigators/AppNavigator';
import { customAction } from '../actions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});




class Controller extends Component {

    constructor(props) {
      super(props)
      this.state = {
        screenDIM: {
          isVerticle: true,
          height: 0,
          width: 0
        },                  //should be just the ones that i need to worry about changing
        deviceObject: props.bluetooth.deviceObject,
        writeServiceUUID: props.bluetooth.writeServiceUUID,
        writeCharacteristicUUID: props.bluetooth.writeCharacteristicUUID
      }
    }



  componentDidMount() {
    var temp = Object.assign({}, this.state)
    var result = Dimensions.get("screen")
    temp.screenDIM.height = result.height
    temp.screenDIM.width = result.width
    temp.screenDIM.isVerticle = (result.height > result.width) ? true : false;
    this.setState(temp)
    Dimensions.addEventListener("change", (object)=>{
      var tempState = Object.assign({}, this.state, {
        screenDIM: {
          height: object.screen.height,
          width: object.screen.width
        }
      })
      this.setState(tempState)
    })
  }

  objectComparison = (a, b) => {
    console.log("a: ", a);
    console.log("b: ", b);
    var result = "match";
    result = Object.keys(a).concat(Object.keys(b)).reduce(function(map, k) {
      if (a[k] !== b[k]) {
        return "no match"
      }
    }, {}) || "match"
    return result;
  }

  componentWillReceiveProps(nextState) {
    console.log("controller device obj: ", nextState.bluetooth);
    if (this.objectComparison(nextState.bluetooth.deviceObject, this.state.deviceObject) == "no match") {
      var temp = Object.assign({}, this.state, {
         deviceObject: nextState.bluetooth.deviceObject
      })
      this.setState(temp)
    }
    if (nextState.bluetooth.writeCharacteristicUUID != this.state.writeCharacteristicUUID){
      var temp = Object.assign({}, this.state, {
         writeCharacteristicUUID: nextState.bluetooth.writeCharacteristicUUID
      })
      this.setState(temp)
    }
    if(nextState.bluetooth.writeServiceUUID != this.state.writeServiceUUID){
      var temp = Object.assign({}, this.state, {
         writeServiceUUID: nextState.bluetooth.writeServiceUUID
      })
      this.setState(temp)
    }
  }

  sendDataThroughService = (value) => {
    console.log("sending data: ", this.state.deviceObject);
    value = value.toString()
    var encodedString = btoa(value);
    // var pattern = [255,255,255,250,250,250,240,240,240,230,230,230,100,100,100,0,0,0,1,1,1,13,13,13,6,6,6,7,7,8,8,8,100,100,100,255,255,255,250,250,250,240,240,240,230,230]
    // for(let i=0; i< pattern.length; i++){
      // var temp = btoa(pattern[i]);/
    if(this.state.deviceObject) {
      this.state.deviceObject.writeCharacteristicWithoutResponseForService(this.state.writeServiceUUID, this.state.writeCharacteristicUUID, encodedString).then((result)=>{
        console.log(result);
      }, (err)=>{
        console.log(err);
      })
    }

    // }
  }

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Controller Screen
        </Text>
        <Slider maximumValue={360} minimumValue={0} style={{height: 40, width: this.state.screenDIM.width * 0.8}} onValueChange={(value)=>{this.sendDataThroughService(value)}}>
        </Slider>
      </View>
    )
  }
};

// Controller.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

// Controller.navigationOptions = {
//   header: null
// };

const mapStateToProps = state => ({
  myNav: state.NavReducer,
  bluetooth: state.BluetoothReducer
});

export default connect(mapStateToProps)(Controller);
