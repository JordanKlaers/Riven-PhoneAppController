import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { saveConnectionData, saveBluetoothState, saveDeviceNameFROMStorage, onlyRedirectOnce } from '../actions'
import { AsyncStorage } from 'react-native';

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});



const Splash = ({ Props, dispatch, navigation}) => {
  // console.log(Props.NavReducer.shouldRedirect);

  if(Props.BluetoothReducer.deviceNameFromStorage != null && Props.BluetoothReducer.subscription != null){
    if ( Props.BluetoothReducer.deviceNameFromStorage == "noSavedDeviceName" || Props.BluetoothReducer.subscription == false && Props.NavReducer.shouldRedirect == true){

    }
    else {

    }
  }




  var bluetoothState = Props.BluetoothReducer.subscription

  const subscription = Props.BluetoothReducer.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        if(bluetoothState == false || bluetoothState == null){
          bluetoothState = true;
          dispatch(saveBluetoothState(bluetoothState))
        }
      }
      else {
        // console.log("PoweredOff");
        if(bluetoothState == true || bluetoothState == null){
          bluetoothState = false;
          dispatch(saveBluetoothState(bluetoothState))
        }
      }
  }, true);



  AsyncStorage.getAllKeys().then((value)=>{
      if(value.includes('savedDeviceName')){
        AsyncStorage.getItem("savedDeviceName").then((name)=>{
          if(Props.BluetoothReducer.deviceNameFromStorage != name){
            dispatch(saveDeviceNameFROMStorage(name))
          }
        })
      }
      else{
        if(Props.BluetoothReducer.deviceNameFromStorage != "noSavedDeviceName"){
          dispatch(saveDeviceNameFROMStorage("noSavedDeviceName"))
        }
      }
      // return value
      }).catch((err)=>{
        console.log("no device name");
        console.log(err);
      })

  return (
    <View>
      <Text style={styles.welcome}>
        {'twentyfive dogs and a cat'}
        {}
      </Text>
      <Button
        onPress={() => {
          dispatch(NavigationActions.navigate({
            routeName: 'TabNav',
            action: NavigationActions.navigate({ routeName: 'bluetooth'}),
            redirectKey: true
          }))
        }}

        title="I dont like that ^^ take me somewhere else"
      />
    </View>
  );
};

Splash.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
Splash.navigationOptions = {
  header: null
}

Splash.componentWillmount = ()=>{
  console.log("component will mount");
}

const mapStateToProps = state => ({
  Props: state,
  manager: state.manager,
  bluetooth: state.bluetoothReducer
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
