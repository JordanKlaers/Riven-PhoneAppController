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
      localRedirectBool: true,
      manager: props.bluetooth.manager,
      currentBluetoothState: props.bluetooth.subscription || null,
      defaultDevice: props.bluetooth.defaultDevice,
      dispatch: props.navigation.dispatch,
      initiatedSetTimeout: false,
      connectedToDevice: props.bluetooth.connectedToDevice,
      dimensions: {},
      haveTriedToConnect: false,
      alldevices: props.bluetooth.allSavedDevices
    }
  }

  componentWillMount(){
    SplashUtil.bluetoothListener(this.state.manager, this.state, this.state.currentBluetoothState, this.state.dispatch, saveBluetoothState);
    SplashUtil.loadDeviceNamesFromStorage(AsyncStorage, this.state.dispatch, this.state.defaultDevice, getSavedDeviceNames, setSelectedDevice)

  }

  componentDidUpdate(state){
    
    var args ={
      redirectBool: this.state.localRedirectBool,
      deviceBluetoothstate: this.state.deviceBluetoothstate,
      defaultDevice: this.state.defaultDevice,
      initializedRedirect: this.state.initiatedSetTimeout,
      setState: this.setState,
      dispatch: this.state.dispatch,
      navigate: NavigationActions.navigate,
      connectedToDevice: this.state.connectedToDevice,
      haveTriedToConnect: this.state.haveTriedToConnect,
      tryToConnect: this.tryToConnect,
      manager: this.state.manager,
      state: this.state,
      scanInProgress: scanInProgress
    }

    SplashUtil.autoConnect(args);
  }

  componentWillReceiveProps(nextState){
    SplashUtil.pushUpdateState(nextState, this.state, this.setState);
  }


  tryToConnect = (defaultDevice, connectedToDevice, manager)=>{

    var deviceConnectionInfo = {};
    if(connectedToDevice != "Connected"){
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
        <Text>{this.state.scannedDeviceName}</Text>
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
