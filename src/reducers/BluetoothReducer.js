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
        defaultDevice: null,           //currentDeviceName
        connectedToDevice: false,         //false in progress or true for connected
        shouldRedirect: true,
        allSavedDevices: [],         //the key == the device name for all
        numberOfSavedDevices:0,
      }

  function BluetoothReducer(state= bluetooth, action) {
    switch (action.type) {
      case 'Save Connection Data':

        state.connectedToDevice = true;                    //need to save so we can send data to the service
        return { ...state, ...action.connectionData };
      case 'Save Bluetooth State':

        state.bluetoothON_OFF = action.state
        return { ...state };
      case 'Save Device Name From Storage':

        state.deviceNameFromStorage = action.deviceName   //currentDeviceName
        return { ...state };
      case 'Load Device Names From Storage':
        var result = Object.assign({}, state, {
          allSavedDevices: action.devices.filter((name)=> {
            return name != "defaultDevice"
          })
        });
        return result
      case 'Load Default Device From Storage':
        var result = Object.assign({}, state, {
          defaultDevice: action.name
        });
        return result;
      case 'Set Default Device':
        var result = Object.assign({}, state,{
          defaultDevice: action.name
        });
        console.log(result);
        return result
      case 'Scan In Progress':

        state.connectedToDevice = "In Progress"
        return { ...state };
      case 'Redirect Is Triggered':

        var result = Object.assign({}, state, {
          shouldRedirect: false
        });
        return result;
      case 'Delete Device Names From Storage':
        // console.log(action);
        console.log("hit");
        AsyncStorage.removeItem(action.deviceName);
        var result = Object.assign({}, state,{
          allSavedDevices: state.allSavedDevices.filter((name)=>{
            return name != action.deviceName;
          })
        });
        return result

      default:
        state.FROMBLUETOOTh = "FROM BLUETOOTHER"
        return state;
     }
  }


export default BluetoothReducer;
