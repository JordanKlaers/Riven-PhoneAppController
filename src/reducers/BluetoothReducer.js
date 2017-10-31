import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { BleManager } from 'react-native-ble-plx';


  var getDeviceNameFromStorage = AsyncStorage.getAllKeys().then((value)=>{
      console.log("all saved storagekeys");
      console.log(value);
        return value
      }).catch((err)=>{
        console.log(err);
      })


  function BluetoothReducer(state={}, action) {
    switch (action.type) {
      case 'Save Connection Data':
        console.log("save connection data in the reducer");
        console.log(action.connectionData);
        console.log(state);
        return { ...state, ...action.connectionData };
      case 'Saving Device Name For Auto Connection':
        AsyncStorage.setItem('savedDeviceName', action.deviceName).then(()=>{
          return { ...state, ...action.deviceName };
        })

      default:
      console.log(action);
      console.log("default ^^");
        return state;
     }
  }


export default BluetoothReducer;
