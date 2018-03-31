import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  saveConnectionData,
  saveBluetoothState,
  saveDeviceNameFROMStorage,   //currentDeviceName
  onlyRedirectOnce,
  redirectForBluetoothConnection,
  scanInProgress,
  connected,
  triggered,
  getSavedDeviceNames,
  setSelectedDevice
} from '../actions'
import { AsyncStorage } from 'react-native';
import SplashUtil from '../util/SplahUtil.js';

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});


class Splash extends Component {

  constructor(props) {
    super(props)
    this.setState = this.setState.bind(this);
    this.state = {                      //should be just the ones that i need to worry about changing
      autoConnectStatus: 'idk',
      localRedirectBool: true,
      manager: props.bluetooth.manager,
      currentBluetoothState: props.bluetooth.subscription || null,
      defaultDevice: props.bluetooth.defaultDevice,
      dispatch: props.navigation.dispatch,
      initiatedSetTimeout: false,
      connectedToDevice: props.bluetooth.connectedToDevice,
      dimensions: {},
      haveTriedToConnect: false
    }
    this.dispatch = props.navigation.dispatch.bind(this);
    
  }

componentDidMount(){

}


  componentWillMount(){
    SplashUtil.bluetoothListener(this.state.manager, this.state, this.state.currentBluetoothState, this.state.dispatch, saveBluetoothState);
    SplashUtil.loadDeviceNamesFromStorage(AsyncStorage, this.state.dispatch, this.state.defaultDevice, getSavedDeviceNames, setSelectedDevice)

  }

  componentDidUpdate(state){
    var redirectBool = this.state.localRedirectBool
    var connectedToDevice = this.state.connectedToDevice
    var defaultDevice = this.state.defaultDevice
    var deviceBluetoothstate = this.state.deviceBluetoothstate
    var manager = this.state.manager
    var haveTriedToConnect = this.state.haveTriedToConnect
    var initializedRedirect = this.state.initiatedSetTimeout;
    var dispatch = this.dispatch
    var navigate = NavigationActions.navigate
    var setState = this.setState


    // var autoConnectStatus = SplashUtil.autoConnect(redirectBool, connectedToDevice, deviceBluetoothstate, defaultDevice, haveTriedToConnect, this.tryToConnect, initializedRedirect, dispatch, navigate, manager, this.setState, this.state);
    // var tempState = Object.assign({}, this.state, {
    //   autoConnectStatus: autoConnectStatus
    // });
    // if (this.state.autoConnectStatus == 'idk') {
    //   this.setState(tempState);
    // }
    
    if(redirectBool){ //are we still on splash page

      if(connectedToDevice == "Connected"){  //are we connected to the device
        var tempState = Object.assign({}, this.state, {
          initiatedSetTimeout: true
        });
        this.setState(tempState, ()=>{
          this.state.dispatch({
            type: 'Redirect Is Triggered',
            action: this.state.dispatch(NavigationActions.navigate({
              routeName: 'controller'
            }))
          })
        })
      }
      else {
        const haveDefaultDevice_BluetoothIsOn = (deviceBluetoothstate != null && defaultDevice !=  "" && deviceBluetoothstate != false && defaultDevice !=  undefined);
        const haveTriedToConnect = this.state.haveTriedToConnect;
        if (haveDefaultDevice_BluetoothIsOn){ // if we have a device name and bluetooth is on try to connect
          if(!haveTriedToConnect){
            this.setState(Object.assign({}, this.state, {
              haveTriedToConnect: true
            }), this.tryToConnect(defaultDevice, connectedToDevice, manager))
          }
        }
        else if((defaultDevice ==  "" && bluetoothON_OFF != null) || (defaultDevice != null && bluetoothON_OFF == false)){

          if(this.state.initiatedSetTimeout == false && this.state.connectedToDevice != "In progress"){
            var tempState = Object.assign({}, this.state, {
              initiatedSetTimeout: true
            });
            this.setState(tempState, ()=>{
              setTimeout(()=>{
                {this.state.dispatch({
                  type: 'Redirect Is Triggered',
                  action: this.state.dispatch(NavigationActions.navigate({
                    routeName: 'bluetooth'
                  }))
                })}
              },2000);
            })
          }
        }
      }
    }
  }
  }

  componentWillReceiveProps(nextState){
    // if(nextState.bluetooth.shouldRedirect != this.state.localRedirectBool){
    //
    //   this.setState({localRedirectBool: nextState.bluetooth.shouldRedirect})
    // }

    if(nextState.bluetooth.deviceNameFromStorage != this.state.defaultDevice){   //currentDeviceName


      var tempState = Object.assign({}, this.state, {
        defaultDevice: nextState.bluetooth.defaultDevice    //currentDeviceName
      });
      this.setState(tempState)
    }
    if(nextState.bluetooth.deviceBluetoothstate != this.state.deviceBluetoothstate){

      var tempState = Object.assign({}, this.state, {
        deviceBluetoothstate: nextState.bluetooth.deviceBluetoothstate
      });
      this.setState(tempState)
    }

    if(nextState.bluetooth.connectedToDevice != this.state.connectedToDevice){

      var tempState = Object.assign({}, this.state, {
        connectedToDevice: nextState.bluetooth.connectedToDevice
      });
      this.setState(tempState)
    }

  }


  tryToConnect = (defaultDevice, connectedToDevice, manager)=>{

    var deviceConnectionInfo = {};
    if(connectedToDevice == "No connection"){
      manager.startDeviceScan(null, null, (error, device) => {
        if(connectedToDevice != "In Progress"){
          this.state.dispatch(scanInProgress())
          var temp = Object.assign({}, this.state, {
            connectedToDevice: "In Progress"
          })
          this.setState(temp, this.forceUpdate())
        }
        if (error) {
          return
        }
        //device.name == this.state.defaultDevice
        if (device.name == defaultDevice) {  //should be 'raspberrypi'

        console.log("device names matched");

          var deviceObject = {};
          manager.stopDeviceScan();
          manager.connectToDevice(device.id)
          .then((device) => {

            deviceObject = device;
            deviceConnectionInfo.device = device;
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {

            deviceConnectionInfo.deviceID = device.id
            return manager.servicesForDevice(device.id)
          })
          .then((services) => {
            console.log("all services: ", services);
            var service = null;
            for(let i=0; i<services.length; i++) {
              if(services[i].uuid == "00112233-4455-6677-8899-aabbccddeeff" && service == null){
                console.log("1:", services[i].uuid);
                service = services[i].uuid

              }
            }
            deviceConnectionInfo.writeServiceUUID = service
            return manager.characteristicsForDevice(deviceConnectionInfo.deviceID, deviceConnectionInfo.writeServiceUUID)
          })
          .then((characteristic)=> {
            console.log("characteristics : ", characteristic);
            if (characteristic[0]) {
              deviceConnectionInfo.writeCharacteristicUUID = characteristic[0].uuid
              this.state.dispatch(saveConnectionData(deviceConnectionInfo, deviceObject))
            }
            else {
              console.log("wasnt good");
            }


          },
          (error) => {

          });
        }
      });
    }
  }

  //

  navigationOptions = {
    header: null
  }


  render() {
    return (
      <View>
        <Text style={{margin: '40%'}}>{this.state.connectedToDevice}</Text>
        <Text>{this.state.autoConnectStatus}</Text>
      </View>
    );
  }

}

// {/* <Button onPress={()=>{
//   {this.state.dispatch({
//     type: 'Redirect Is Triggered',
//     action: this.state.dispatch(NavigationActions.navigate({
//       routeName: 'bluetooth'
//     }))
//   })}
// }} title="dispatch button"  /> */}

Splash.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
Splash.navigationOptions = {
  header: null
}

const mapStateToProps = state => ({
  myNav: state.NavReducer,
  bluetooth: state.BluetoothReducer
});

export default connect(mapStateToProps)(Splash);
