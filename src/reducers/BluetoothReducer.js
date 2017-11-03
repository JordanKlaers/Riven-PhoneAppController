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
        bluetoothON_OFF: bluetoothSubscription,
        deviceNameFromStorage: null,
        scanAndConnect: false,         //false in progress or true for connected
      }

  function BluetoothReducer(state= bluetooth, action) {
    switch (action.type) {
      case 'Save Connection Data':
        state.scanAndConnect = true;                    //need to save so we can send data to the service
        return { ...state, ...action.connectionData };
      case 'Saving Device Name For Auto Connection':
        AsyncStorage.setItem('savedDeviceName', action.deviceName).then(()=>{
          return { ...state, ...action.deviceName };
        })
      case 'Save Bluetooth State':
        state.bluetoothON_OFF = action.state
        return { ...state };
      case 'Save Device Name From Storage':
        state.deviceNameFromStorage = action.deviceName
        return { ...state };
      case 'Scan In Progress':
        state.scanAndConnect = "In Progress"
        return { ...state };
      default:
      console.log("was this also hit");
        return state;
     }
  }


export default BluetoothReducer;
