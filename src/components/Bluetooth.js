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
  Switch,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppNavigator } from '../navigators/AppNavigator';
import {
  deleteDeviceNameFromStorage,
  setDefaultDevice,
  saveDeviceNameTOStorage,
  saveConnectionData,
  scanInProgress
} from '../actions'
import upRight from '../style/bluetooth/upright.js'

const backgroundImage = require('../../image/bluetooth.jpg');

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
      defaultDevice: props.bluetooth.defaultDevice,
      toggelSelection: false,
      manager: props.bluetooth.manager,
      dispatch: this.props.navigation.dispatch
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

  }

  componentWillReceiveProps(nextState){
    console.log("NEXT all saved devices: ", nextState.bluetooth.allSavedDevices);
    console.log("PREVIOUS all saved devices: ", this.state.allSavedDevices);
    if(nextState.bluetooth.allSavedDevices != this.state.allSavedDevices){
      var temp = Object.assign({}, this.state, {
        allSavedDevices: nextState.bluetooth.allSavedDevices
      })
      this.setState(temp, ()=>{
        this.forceUpdate();
      })
    }
    if(nextState.bluetooth.defaultDevice != this.state.defaultDevice) {
      var temp = Object.assign({}, this.state, {
        defaultDevice: nextState.bluetooth.defaultDevice
      })
      if(!this.state.allSavedDevices.includes(nextState.bluetooth.defaultDevice) && nextState.bluetooth.defaultDevice != ""){
        console.log("messy stuff");
        temp.allSavedDevices.push(nextState.bluetooth.defaultDevice)
      }
      console.log(nextState.bluetooth.defaultDevice, ": should be the current default device");
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

  saveNewDevice = ()=>{
    if(this.state.textInput != "" && !this.state.allSavedDevices.includes(this.state.textInput.toLowerCase().replace(/\s+/g, ''))) {
      this.props.dispatch(saveDeviceNameTOStorage(this.state.textInput.toLowerCase().replace(/\s+/g, '')))
    }
  }

  removeDevice = (name) => {
    var tempState = Object.assign({}, this.state, {
      allSavedDevices: this.state.allSavedDevices.filter((deviceName)=>{
        return deviceName != name;
      })
    })
    this.setState(tempState, ()=> {
      this.props.dispatch(deleteDeviceNameFromStorage(name));
    })
  }

  selectDefaultDevice = (name) => {
    AsyncStorage.setItem('defaultDevice', name)
    this.props.dispatch(setDefaultDevice(name))
  }

  connectionStatus = () => {
    if(this.state.connectToDevice === "In Progress"){
      return this.state.connectToDevice
    }
    else {
      return this.state.connectToDevice ?  "Connected" : "No Connection"
    }
  }

  toggelDefaultDeviceSelection = () => {
    var temp = Object.assign({}, this.state, {
      toggelSelection: !this.state.toggelSelection
    })
    this.setState(temp)
  }


  tryToConnect = (deviceName, connectedToDevice, manager)=>{
    var deviceConnectionInfo = {};
    if(connectedToDevice == "No connection"){
      console.log("connceted to device was -no connection");
      manager.startDeviceScan(null, null, (error, device) => {
        if(connectedToDevice != "In Progress"){
          this.state.dispatch(scanInProgress())
          var temp = Object.assign({}, this.state, {
            connectedToDevice: "In Progress"
          })
          this.setState(temp)
        }
        if (error) {
          return
        }
        if (device.name == this.state.defaultDevice) {  //should be 'raspberrypi'
        console.log("the scan matched default device name");
          manager.stopDeviceScan();
          manager.connectToDevice(device.id)
          .then((device) => {
            deviceConnectionInfo.device = device;
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {
            deviceConnectionInfo.deviceID = device.id
            return manager.servicesForDevice(device.id)
          })
          .then((services) => {
            deviceConnectionInfo.writeServiceUUID = services[2].uuid
            return manager.characteristicsForDevice(deviceConnectionInfo.deviceID, deviceConnectionInfo.writeServiceUUID)
          })
          .then((characteristic)=> {
            deviceConnectionInfo.writeCharacteristicUUID = characteristic[0].uuid
            this.state.dispatch(saveConnectionData(deviceConnectionInfo))
            // var temp = Object.assign({}, this.state, {
            //   connectedToDevice: "Connected"
            // })
            // this.setState(temp)
          },
          (error) => {

          });
        }
      });
    }

  }



  render(){



    const dimensions = {
      height: this.state.screenDIM.height,
      width: this.state.screenDIM.width
    }
    const style = {
      upRight: {
        overlay: {
          position: 'absolute',
          height: dimensions.height,
          width: dimensions.width,
        },
        bluetoothContainer: {
          width: dimensions.width - 40,
          margin: 20,
          height: 200,
          borderRadius: 10,
          borderWidth: 5,
          borderColor: 'black',
          backgroundColor: "#bababa",
          // display: 'flex',
        },
        row: {
          display: 'flex',
          flexDirection: 'row',
          flex: 1
        },
        left: {
          flex:1,
          height: 50,
        },
        right: {
          alignItems: 'flex-end',
          flex:1,
          height: 50
        },
        bluetoothText: {
          margin: 15
        },
        deviceNameTouchable: {
          alignItems: 'flex-end',
          width: '100%',
          height: 50
        },
        deviceNameInput: {
          height: 40,
          width: dimensions.width - 60,
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          borderWidth: 5,
          borderColor: 'black',
        },
        deviceList: {
          width: dimensions.width - 40,
          margin: 20,
          height: 150,
          borderRadius: 10,
          borderWidth: 5,
          borderColor: 'black',
          backgroundColor: "#bababa",
        },
        saveButton: {
          height: 40,
          width: dimensions.width - 60,
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          borderWidth: 5,
          borderColor: 'black',
        }
      }
    }
    var uniqueID = 0;
    const resizeMode = "center";

    if (this.state.toggelSelection) {
      return(
        <View>

          <Image
            style={{
              height: dimensions.height,
              width: dimensions.width,
              position: "relative"
            }}
            source={backgroundImage}
          />
          <View style={style.upRight.overlay}>
            <View style={style.upRight.bluetoothContainer}>
                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                      Bluetooth
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <Text style={style.upRight.bluetoothText}>
                      {this.state.bluetoothON_OFF ? "On" : "Off"}
                    </Text>
                  </View>
                </View>

                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                      Connection
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <Text style={style.upRight.bluetoothText}>
                      {this.state.connectedToDevice}
                    </Text>
                  </View>
                </View>

                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                     Device
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <TouchableHighlight style={style.upRight.deviceNameTouchable} onPress={()=>{this.toggelDefaultDeviceSelection()}}>
                      <Text style={style.upRight.bluetoothText}>
                        {this.state.defaultDevice}
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
            </View>

            <View style={style.upRight.deviceList} >
            {this.state.allSavedDevices.map((name, indx) =>(
              <View key={indx}>
                 <TouchableHighlight onPress={()=>{this.selectDefaultDevice(name)}}>
                   <Text>
                     {name}
                   </Text>
                 </TouchableHighlight>
                   <Button onPress={()=>{
                     this.removeDevice(name)
                   }} title="x" />
               </View>
            ))}
            </View>


            <TouchableHighlight onPress={()=>{this.tryToConnect(this.state.defaultDevice, this.state.connectedToDevice, this.state.manager)}} style={style.upRight.saveButton}>
              <Text>
                Try to Connect
              </Text>
            </TouchableHighlight>



            <TextInput
             style={style.upRight.deviceNameInput}
             onChangeText={(input)=>{this.updateText(input)}}
            />
            <TouchableHighlight onPress={()=>{this.saveNewDevice()}} style={style.upRight.saveButton}>
              <Text>
                Save
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
    else {
      return (
        <View>

          <Image
            style={{
              height: dimensions.height,
              width: dimensions.width

            }}
            source={backgroundImage}
          />
          <View style={style.upRight.overlay}>
            <View style={style.upRight.bluetoothContainer}>
                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                      Bluetooth
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <Text style={style.upRight.bluetoothText}>
                      {this.state.bluetoothON_OFF ? "On" : "Off"}
                    </Text>
                  </View>
                </View>

                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                      Connection
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <Text style={style.upRight.bluetoothText}>
                      {this.state.connectedToDevice}
                    </Text>
                  </View>
                </View>

                <View style={style.upRight.row}>
                  <View style={style.upRight.left}>
                    <Text style={style.upRight.bluetoothText}>
                     Device
                    </Text>
                  </View>
                  <View style={style.upRight.right}>
                    <TouchableHighlight style={style.upRight.deviceNameTouchable} onPress={()=>{this.toggelDefaultDeviceSelection()}}>
                      <Text style={style.upRight.bluetoothText}>
                        {this.state.defaultDevice}
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
            </View>

            <TouchableHighlight onPress={()=>{this.tryToConnect(this.state.defaultDevice, this.state.connectedToDevice, this.state.manager)}} style={style.upRight.saveButton}>
              <Text>
                Try to Connect
              </Text>
            </TouchableHighlight>


            <TextInput
             style={style.upRight.deviceNameInput}
             onChangeText={(input)=>{this.updateText(input)}}
            />
            <TouchableHighlight onPress={()=>{this.saveNewDevice()}} style={style.upRight.saveButton}>
              <Text>
                Save
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
  }
}

Bluetooth.navigationOptions = {
  title: 'Bluetooth',
  header: null
};

const mapStateToProps = state => ({
  myNav: state.NavReducer,
  bluetooth: state.BluetoothReducer
});

export default connect(mapStateToProps)(Bluetooth);
