import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  AsyncStorage,
  Dimensions,
  FlatList,
  TouchableHighlight,
  Picker,
  Switch
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppNavigator } from '../navigators/AppNavigator';
import {
  deleteDeviceNameFromStorage,
  setDefaultDevice
} from '../actions'

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

    super(props)
    this.state = {
      screenDIM: {
        isVerticle: true,
        height: 0,
        width: 0
      },                     //should be just the ones that i need to worry about changing
      bluetoothON_OFF: props.bluetooth.bluetoothON_OFF,
      connectedToDevice: props.bluetooth.connectedToDevice,
      textInput: "",
      allSavedDevices: [],
      defaultDevice: props.bluetooth.defaultDevice
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

  listDevices = []
  componentDidUpdate(state){
    // console.log(state.allSavedDevices);

  }

  componentWillReceiveProps(nextState){
    if(nextState.bluetooth.allSavedDevices.length != this.state.allSavedDevices.length){
      var temp = Object.assign({}, this.state, {
        allSavedDevices: nextState.bluetooth.allSavedDevices
      })
      // console.log(temp);
      this.setState(temp)
    }
    if(nextState.bluetooth.defaultDevice != this.state.defaultDevice) {
      var temp = Object.assign({}, this.state, {
        defaultDevice: nextState.bluetooth.defaultDevice
      })
      this.setState(temp)
    }
    if(nextState.bluetooth.connectedToDevice != this.state.connectedToDevice) {
      var temp = Object.assign({}, this.state, {
        connectedToDevice: nextState.bluetooth.connectedToDevice
      })
      this.setState(temp)
    }
  }
  navigationOptions = {
    header: null
  }

  updateText = (input)=>{
    var tempState = Object.assign({}, this.state, {
      textInput: input
    })
    this.setState(tempState)
  }

  logAll = ()=>{
    console.log(this.state.allSavedDevices);
    // AsyncStorage.getAllKeys().then((value)=>{
    //   console.log(value);
    //   }).catch((err)=>{
    //
    //   })
  }

  saveNewDevice = async ()=>{
    if(this.state.textInput != ""){
      try {
        await AsyncStorage.setItem(this.state.textInput, this.state.textInput);
      } catch (error) {
        console.log(error);
      }
    }
  }

  removeDevice = (name) => {
    this.props.dispatch(deleteDeviceNameFromStorage(name))
  }

  selectDefaultDevice = (name) => {
    AsyncStorage.setItem('defaultDevice', name)
    this.props.dispatch(setDefaultDevice(name))
  }

  testing = (name, index) => {
    console.log("name: ", name , "index: ", index);
  }

  connectionStatus = () => {
    if(this.state.connectToDevice === "In Progress"){
      return this.state.connectToDevice
    }
    else {
      return this.state.connectToDevice ?  "Connected" : "No Connection"
    }
  }
  render(){

    const dimensions = {
      height: this.state.screenDIM.height,
      width: this.state.screenDIM.width
    }
    const style = {
      page: {
        height: dimensions.height,
        width: dimensions.width,
        backgroundColor: "lightblue"
      },
      bluetoothContainer: {
        width: dimensions.width - 40,
        margin: 20,
        height: 200,
        backgroundColor: "white",
        // display: 'flex',
      },
      selectionContainer: {
        width: dimensions.width - 40,
        margin: 20,
        height: 200,
        backgroundColor: "white"
      },
      value: {
        alignSelf: "flex-end",
        backgroundColor: 'orange',
        marginRight: 10
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1
      },
      left: {
        flex:1,
        height: 50,
        backgroundColor: 'yellow'
      },
      right: {
        alignItems: 'flex-end',
        flex:1,
        backgroundColor: 'orange',
        height: 50
      }
    }
    var uniqueID = 0;


    return(
      <View style={style.page}>
        <View style={style.bluetoothContainer}>
            <View style={style.row}>
              <View style={style.left}>
                <Text>
                  Bluetooth
                </Text>
              </View>
              <View style={style.right}>
                <Text>
                  {this.state.bluetoothON_OFF ? "On" : "Off"}
                </Text>
              </View>
            </View>

            <View style={style.row}>
              <View style={style.left}>
                <Text>
                  Connection
                </Text>
              </View>
              <View style={style.right}>
                <Text>
                  {this.connectionStatus()}
                </Text>
              </View>
            </View>

            <View style={style.row}>
              <View style={style.left}>
                <Text>
                 Device
                </Text>
              </View>
              <View style={style.right}>
                <Text>
                  {this.state.defaultDevice}
                </Text>
              </View>
            </View>
        </View>


        <View style={style.selectionContainer} >

        </View>





        <Text>{this.state.defaultDevice}</Text>

        <Text>
          {this.state.bluetoothON_OFF ? "On" : "Off"}
        </Text>

        <TextInput
         style={{height: style.height*0.1, width: style.width*0.8, marginTop: style.height*0.1, marginLeft: style.width*0.1,  borderColor: 'pink', borderWidth: 3, backgroundColor: 'white'}}
         onChangeText={(input)=>{this.updateText(input)}}
        />
        <Button onPress={()=>{this.saveNewDevice()} } title="save" />
        <Button onPress={()=>{this.logAll()} } title="log all" />
        {
          this.state.allSavedDevices.map((name, indx) =>(
            <View key={indx}>
              <TouchableHighlight onPress={()=>{this.selectDefaultDevice(name)}}>
                <Text>{name}</Text>
              </TouchableHighlight>
              <Button onPress={()=>{
                this.removeDevice(name)
                // console.log(name);
              }} title="x" />
            </View>
          ))
        }
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
