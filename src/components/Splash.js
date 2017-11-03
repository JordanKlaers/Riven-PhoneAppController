import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { saveConnectionData, saveBluetoothState, saveDeviceNameFROMStorage, onlyRedirectOnce, redirectForBluetoothConnection } from '../actions'
import { AsyncStorage } from 'react-native';

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
    this.manager = this.props.bluetooth.manager;
    this.currentBluetoothState = this.props.bluetooth.subscription;
    this.dispatch = this.props.dispatch;
    this.deviceNameFromStorage = this.props.bluetooth.deviceNameFromStorage
  }

  componentWillMount(){
    this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        if(this.currentBluetoothState == false || this.currentBluetoothState == null){
          this.currentBluetoothState = true;
          this.dispatch(saveBluetoothState(this.currentBluetoothState))
        }
      }
      else {
        if(this.currentBluetoothState == true || this.currentBluetoothState == null){
          this.currentBluetoothState = false;
          this.dispatch(saveBluetoothState(this.currentBluetoothState))
        }
      }
    }, true);

    AsyncStorage.getAllKeys().then((value)=>{
      if(value.includes('savedDeviceName')){
        AsyncStorage.getItem("savedDeviceName").then((name)=>{
          if(this.deviceNameFromStorage != name){
            this.dispatch(saveDeviceNameFROMStorage(name))
          }
        })
      }
      else{
        if(this.deviceNameFromStorage != "noSavedDeviceName"){
          this.dispatch(saveDeviceNameFROMStorage("noSavedDeviceName"))
        }
      }
      // return value
      }).catch((err)=>{
        console.log("no device name");
        console.log(err);
      })

  }
  componentDidMount(){

  }
  componentWillReceiveProps(nextState){
    console.log("this will be next state");
    console.log(nextState);
    if(nextState.bluetooth.deviceNameFromStorage != null && nextState.bluetooth.bluetoothON_OFF != null){
      if ( nextState.bluetooth.deviceNameFromStorage == "noSavedDeviceName" || nextState.bluetooth.bluetoothON_OFF == false && nextState.shouldRedirect == true){
        console.log("redirect for bluetooth");
        setTimeout(()=>{this.dispatch(NavigationActions.navigate({
          routeName: 'TabNav',
          action: NavigationActions.navigate({ routeName: 'bluetooth'}),
          redirectKey: true
        }))},5000);
      }
      else if (nextState.bluetooth.deviceNameFromStorage != "noSavedDeviceName" && nextState.bluetooth.bluetoothON_OFF == true && nextState.shouldRedirect == true){
        console.log("time to scan and connect");
        var deviceConnectionInfo = {}
        console.log(nextState.bluetooth.manager);
        nextState.bluetooth.manager.startDeviceScan(null, null, (error, device) => {
          console.log("scanning");
          if (error) {
            console.log(error);
            return
          }
          if (device.name === nextState.bluetooth.deviceNameFromStorage) {  //should be 'raspberrypi'
            nextState.bluetooth.manager.stopDeviceScan();
            nextState.bluetooth.manager.connectToDevice(device.id)
              .then((device) => {
                deviceConnectionInfo.device = device;
                return device.discoverAllServicesAndCharacteristics();
              })
              .then((device) => {
                deviceConnectionInfo.deviceID = device.id
                return nextState.bluetooth.manager.servicesForDevice(device.id)
              })
              .then((services) => {
                deviceConnectionInfo.writeServiceUUID = services[2].uuid
                return nextState.bluetooth.manager.characteristicsForDevice(deviceConnectionInfo.deviceID, deviceConnectionInfo.writeServiceUUID)
              })
              .then((characteristic)=> {
                console.log("connected");
                deviceConnectionInfo.writeCharacteristicUUID = characteristic[0].uuid
                nextState.dispatch(saveConnectionData(deviceConnectionInfo))
              }, (error) => {
                console.log(error);
              });
            }
        });

      }
      else if (nextState.shouldRedirect == true){
        console.log("redirect for the good stuff");
        //TODO try to connect


        // setTimeout(()=>{this.dispatch(NavigationActions.navigate({
        //   routeName: 'TabNav',
        //   action: NavigationActions.navigate({ routeName: 'controller'}),
        //   redirectKey: true
        // }))},5000);
      }
    }
  }



  navigationOptions = {
    header: null
  }

  render() {
    return (
      <View>
        <Text>Hello world!</Text>
        <Button onPress={()=>{this.dispatch(NavigationActions.navigate({
          routeName: 'TabNav',
          action: NavigationActions.navigate({ routeName: 'bluetooth'}),
          redirectKey: true
        }))}} title="manual redirect"  />
      </View>
    );
  }
}

Splash.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
Splash.navigationOptions = {
  header: null
}

const mapStateToProps = state => ({
  shouldRedirect: state.NavReducer.shouldRedirect,
  bluetooth: state.BluetoothReducer
});

export default connect(mapStateToProps)(Splash);















// AsyncStorage.getItem('savedDeviceName').then((value)=>{
//   if (value !== null){
//   }
// }).catch((error) => {
//   console.log("error with storage");
// })
//
// var manager = Props.nav.manager
// var tempState = {};
// const subscription = manager.onStateChange((state) => {
//       if (state === 'PoweredOn') {
//         // console.log("PoweredOn");
//         // console.log(myProps);
//           scanAndConnect();
//           // subscription.remove();
//       }
//       else {
//
//       }
//   }, true);
//
// var scanAndConnect = () => {
//
//   manager.startDeviceScan(null, null, (error, device) => {
//
//       if (error) {
//           return
//       }
//       if (device.name === 'raspberrypi') {
//           manager.stopDeviceScan();
//
//           manager.connectToDevice(device.id)
//               .then((device) => {
//                 tempState.device = device;
//                 return device.discoverAllServicesAndCharacteristics();
//               })
//               .then((device) => {
//                 tempState.deviceID = device.id
//                 return manager.servicesForDevice(device.id)
//               })
//               .then((services) => {
//
//                 tempState.writeServiceUUID = services[2].uuid
//
//                 return manager.characteristicsForDevice(tempState.deviceID, tempState.writeServiceUUID)
//               }).then((characteristic)=> {
//
//                 tempState.writeCharacteristicUUID = characteristic[0].uuid
//                 dispatch(saveConnectionData(tempState))
//               }, (error) => {
//                 console.log(error);
//               });
//       }
//   });
// }
//
