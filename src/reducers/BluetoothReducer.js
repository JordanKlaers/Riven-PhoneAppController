import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { BleManager } from 'react-native-ble-plx';


  // var getDeviceNameFromStorage = AsyncStorage.getAllKeys().then((value)=>{
  //     console.log("all saved storagekeys");
  //     console.log(value);
  //       return value
  //     }).catch((err)=>{
  //       console.log(err);
  //     })
  // async function getSavedDeviceName(){
  //   await AsyncStorage.getItem("savedDeviceName")
  // }


      var manager = new BleManager();
      var bluetoothSubscription = null;
      var bluetooth = {
        manager: manager,
        subscription: bluetoothSubscription,
        deviceNameFromStorage: null,
      }

  function BluetoothReducer(state= bluetooth, action) {
    switch (action.type) {
      case 'Save Connection Data':                     //need to save so we can send data to the service
        return { ...state, ...action.connectionData };
      case 'Saving Device Name For Auto Connection':
        AsyncStorage.setItem('savedDeviceName', action.deviceName).then(()=>{
          return { ...state, ...action.deviceName };
        })
      case 'Save Bluetooth State':
          state.subscription = action.state
        return { ...state };
      case 'Save Device Name From Storage':
        state.deviceNameFromStorage = action.deviceName
        return { ...state };
      default:
        return state;
     }
  }


export default BluetoothReducer;
