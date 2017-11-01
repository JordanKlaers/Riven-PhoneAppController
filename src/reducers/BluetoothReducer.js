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

  var bluetoothManager = new BleManager();

  function BluetoothReducer(state= bluetoothManager, action) {
    switch (action.type) {
      case 'Save Connection Data':                     //need to save so we can send data to the service
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
