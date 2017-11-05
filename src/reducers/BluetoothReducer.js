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
        connectedToDevice: false,         //false in progress or true for connected
        shouldRedirect: true
      }

  function BluetoothReducer(state= bluetooth, action) {
    switch (action.type) {
      case 'Save Connection Data':
        console.log("save connection data");
        state.connectedToDevice = true;                    //need to save so we can send data to the service
        return { ...state, ...action.connectionData };
      case 'Saving Device Name For Auto Connection':
        console.log("save device name TO storage");
        AsyncStorage.setItem('savedDeviceName', action.deviceName).then(()=>{
          return { ...state, ...action.deviceName };
        })
      case 'Save Bluetooth State':
        console.log("saving bluetooth state");
        console.log(action.state);
        state.bluetoothON_OFF = action.state
        return { ...state };
      case 'Save Device Name From Storage':
      console.log("saving device name FROM storage");
      console.log(action.deviceName);
        state.deviceNameFromStorage = action.deviceName
        return { ...state };
      case 'Scan In Progress':
        console.log("scan in progres");
        state.connectedToDevice = "In Progress"
        return { ...state };
      case 'Redirect Is Triggered':
        console.log("redirect triggered?");
        var result = Object.assign({}, state, {
          shouldRedirect: false
        });
        return result
        break;
      default:
        state.FROMBLUETOOTh = "FROM BLUETOOTHER"
        return state;
     }
  }


export default BluetoothReducer;
