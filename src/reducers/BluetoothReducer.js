import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { BleManager } from 'react-native-ble-plx';


      var manager = new BleManager();
      var bluetoothSubscription = null;
      var bluetooth = {
        manager: manager,
        deviceBluetoothstate: bluetoothSubscription,
        defaultDevice: "",           //currentDeviceName
        connectedToDevice: "No connection",         //false in progress or true for connected
        shouldRedirect: true,
        allSavedDevices: [],         //the key == the device name for all
        deviceObject: {}
      }

  function BluetoothReducer(state= bluetooth, action) {
    switch (action.type) {
      case 'Save Connection Data':
        state.deviceObject = action.deviceObject
        state.connectedToDevice = "Connected";                    //need to save so we can send data to the service
        return { ...state, ...action.connectionData };

      case 'Save Bluetooth State':

        state.deviceBluetoothstate = action.state
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
      console.log("loading from Storage: ", action.name);
        var result = Object.assign({}, state, {
          defaultDevice: action.name
        });
        return result;
      case 'Set Default Device':
        var result = Object.assign({}, state,{
          defaultDevice: action.name
        });
        return result
      case 'Save Device Name To Storage':

        var result = Object.assign({}, state);
        result.allSavedDevices.push(action.deviceName);
        if(result.defaultDevice == null || result.defaultDevice == ""){
          console.log("set default when saved");
          result.defaultDevice = action.deviceName
          AsyncStorage.setItem('defaultDevice', action.deviceName);
          AsyncStorage.setItem(action.deviceName, action.deviceName);
        }
        else {
          AsyncStorage.setItem(action.deviceName, action.deviceName);
        }
        // AsyncStorage.getAllKeys().then((value)=>{
        //   console.log("storage keys: ", value);
        //   console.log("all saved devices: ", result.allSavedDevices);
        // })
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
        AsyncStorage.removeItem(action.deviceName);
        var result = Object.assign({}, state,{
          allSavedDevices: state.allSavedDevices.filter((name)=>{
            return name != action.deviceName;
          })
        });
        if(result.defaultDevice == action.deviceName){
          result.defaultDevice = "";
          AsyncStorage.setItem('defaultDevice', "")
        }
        return result
      default:
        state.FROMBLUETOOTh = "FROM BLUETOOTHER"
        return state;
     }
  }


export default BluetoothReducer;
