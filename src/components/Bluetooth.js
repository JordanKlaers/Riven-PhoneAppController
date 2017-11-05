import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, AsyncStorage, Dimensions } from 'react-native';
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


class Bluetooth extends Component {

  constructor(props) {
    console.log(props);
    super(props)
    this.state = {
      screenDIM: {
        isVerticle: true,
        height: 0,
        width: 0,
        bluetoothON_OFF: props.bluetooth.bluetoothON_OFF
      }                     //should be just the ones that i need to worry about changing
    }
  }
  componentWillMount(){
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
  componentDidUpdate(state){
    console.log(this.state);
  }
  componentWillReceiveProps(nextState){
  }
  navigationOptions = {
    header: null
  }
  render(){

    const style = {
      height: this.state.screenDIM.height,
      width: this.state.screenDIM.width
    }
    return(
      <View style={{height: style.height, width: style.width, backgroundColor: "blue"}}>

      </View>
    )
  }
}

//
// <Text style={styles.welcome}>
//   Bluetooth Settings
// </Text>
// <Text>
//   Save device name for auto connection
// </Text>
// <TextInput
//  style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
//  onChangeText={async (value) => {
//     try {
//       await AsyncStorage.setItem('savedDeviceName', value);
//     } catch (error) {
//       console.log(error);
//     }
//  }}
// />

// const Bluetooth = ({ Props, dispatch, navigation}) => {
//   // console.log(Props);
//   return (
//
//   )
// };

Bluetooth.navigationOptions = {
  title: 'Bluetooth',
  header: null
};

const mapStateToProps = state => ({
  myNav: state.NavReducer,
  bluetooth: state.BluetoothReducer
});

export default connect(mapStateToProps)(Bluetooth);
