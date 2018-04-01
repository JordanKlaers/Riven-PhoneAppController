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
  setSelectedDevice,
  saveDeviceNameTOStorage,
  saveConnectionData,
  scanInProgress,
  notOnSplashPage
} from '../actions';
import BluetoothUtil from '../util/BluetoothUtil.js';

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
    this.setState = this.setState.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.state = {
      screenDIM: {
        isVerticle: true,
        height: 0,
        width: 0
      },                     //should be just the ones that i need to worry about changing
      deviceBluetoothstate: props.bluetooth.deviceBluetoothstate,
      connectedToDevice: props.bluetooth.connectedToDevice,
      textInput: "",
      allSavedDevices: [],
      defaultDevice: props.bluetooth.defaultDevice,
      toggelSelection: false,
      manager: props.bluetooth.manager,
      dispatch: this.props.navigation.dispatch,
      waitedForScan: false
    }
  }
  componentWillMount(){
    this.state.dispatch(notOnSplashPage());
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

  componentDidMount(state){
    if(this.state.connectedToDevice == 'In Progress' && !this.state.waitedForScan) {
          var temp = Object.assign({}, this.state, {
              waitedForScan: true
          });
          this.setState(temp, ()=>{
                  var temp = Object.assign({}, this.state, {
                      connectedToDevice: "no connection"
                  });
                  this.setState(temp, ()=>{
                      this.state.manager.stopDeviceScan();
                  })
          })
      }
  }
  componentWillReceiveProps(nextState){
    this.count ++
    const args = {
      nextState: nextState,
      setState: this.setState,
      forceUpdate: this.forceUpdate,
      state: this.state,
      manager: this.state.manager
    }
    this.connectionStatus(nextState.connectedToDevice);
    BluetoothUtil.pushUpdateState(args);
    
  }

  navigationOptions = {
    header: null
  }

  updateText = (input) => BluetoothUtil.updateText({input, setState: this.setState, state: this.state});

  saveNewDevice = () => BluetoothUtil.saveNewDevice({state: this.state, dispatch: this.props.dispatch, save: saveDeviceNameTOStorage});

  removeDevice = (name) => BluetoothUtil.removeDevice({name: name, state: this.state, setState: this.setState, dispatch: this.props.dispatch, delete: deleteDeviceNameFromStorage})

  selectDefaultDevice = (name) => BluetoothUtil.selectDefaultDevice({name: name, dispatch: this.props.dispatch, set: setSelectedDevice})

  connectionStatus = (connectedToDevice) =>  BluetoothUtil.connectionStatus(connectedToDevice)

  toggelDefaultDeviceSelection = () => {
    var temp = Object.assign({}, this.state, {
      toggelSelection: !this.state.toggelSelection
    })
    this.setState(temp)
  }


  tryToConnect = () => BluetoothUtil.tryToConnect({connectedToDevice: this.state.connectedToDevice, manager: this.state.manager, dispatch: this.state.dispatch, scan: scanInProgress, save: saveConnectionData, setState: this.setState})


  // (deviceName, connectedToDevice, manager)=>{

  //   var deviceConnectionInfo = {};
  //   if(connectedToDevice == "No connection"){
  //     manager.startDeviceScan(null, null, (error, device) => {
  //       if(connectedToDevice != "In Progress"){
  //         this.state.dispatch(scanInProgress())
  //         var temp = Object.assign({}, this.state, {
  //           connectedToDevice: "In Progress"
  //         })
  //         this.setState(temp)
  //       }
  //       if (error) {
  //         return
  //       }
  //       if (device.name == this.state.defaultDevice) {  //should be 'raspberrypi'
  //         var deviceObject = {};
  //         manager.stopDeviceScan();
  //         manager.connectToDevice(device.id)
  //         .then((device) => {
  //           deviceObject = device;
  //           deviceConnectionInfo.device = device;
  //           return device.discoverAllServicesAndCharacteristics();
  //         })
  //         .then((device) => {
  //           deviceConnectionInfo.deviceID = device.id
  //           return manager.servicesForDevice(device.id)
  //         })
  //         .then((services) => {
  //           console.log("Services: ", services);
  //           var service;
  //           for(let i=0; i<services.length; i++) {
  //             if(services[i].uuid == "ffffffff-ffff-ffff-ffff-fffffffffff0"){
  //               service = services[i].uuid
  //               console.log("got it:", service);
  //             }
  //           }
  //           deviceConnectionInfo.writeServiceUUID = service
  //           return manager.characteristicsForDevice(deviceConnectionInfo.deviceID, deviceConnectionInfo.writeServiceUUID)
  //         })
  //         .then((characteristic)=> {
  //           deviceConnectionInfo.writeCharacteristicUUID = characteristic[0].uuid
  //           this.state.dispatch(saveConnectionData(deviceConnectionInfo, deviceObject))
  //           // var temp = Object.assign({}, this.state, {
  //           //   connectedToDevice: "Connected"
  //           // })
  //           // this.setState(temp)
  //         },
  //         (error) => {

  //         });
  //       }
  //     });
  //   }

  // }

  stopScan = () => {
    var temp = Object.assign({}, this.state, {
      connectedToDevice: "no connection"
    });
    this.state.manager.stopDeviceScan();
    this.setState(temp)
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
                      {this.state.deviceBluetoothstate ? "On" : "Off"}
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
                    <TouchableHighlight style={style.upRight.deviceNameTouchable} onPress={()=>{this.stopScan()}}>
                      <Text style={style.upRight.bluetoothText}>
                        {this.state.connectedToDevice}
                      </Text>
                    </TouchableHighlight>
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
             onChangeText={(input)=>{this.updateText(input, this.setState)}}
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
                      {this.state.deviceBluetoothstate ? "On" : "Off"}
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
                    <TouchableHighlight style={style.upRight.deviceNameTouchable} onPress={()=>{this.stopScan()}}>
                      <Text style={style.upRight.bluetoothText}>
                        {this.state.connectedToDevice}
                      </Text>
                    </TouchableHighlight>
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
