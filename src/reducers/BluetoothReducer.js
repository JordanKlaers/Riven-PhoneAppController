import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { connectFunction } from '../actions';


      var manager = new BleManager();
      var bluetoothSubscription = null;
      var bluetooth = {
        onSplashPage: true,
        manager: manager,
        deviceBluetoothstate: bluetoothSubscription,
        defaultDevice: "",           //currentDeviceName
        connectedToDevice: "No connection",         //false in progress or true for connected
        shouldRedirect: true,
        allSavedDevices: [],         //the key == the device name for all
        deviceObject: {},
        splashtestprop: null,
        deviceObject: {},
        connectFunction: null,
        navigateAfterConnection: false,
        learning: 'nothing',
        triggered: 'nothing'
      }

  function BluetoothReducer(state= bluetooth, action) {
    switch (action.type) {
      case "learningDispatch":
      console.log('inside the learning dispatch function');
        console.log('-------->' , action.learningDispatchObj);  
      return Object.assign({}, state, action.learningDispatchObj)
      case "connect function":
        return Object.assign({}, state, {connectFunction: action.connectFunction})
      case 'Save Connection Data':
      console.log('reducer: saving connection data');
        var result = Object.assign(
          {}, 
          state, {
            deviceObject: action.deviceObject,
            connectedToDevice: "Connected"
          }, 
          action.connectionData, 
          {navigateAfterConnection: action.navigateAfterConnection || false}
        );
        // console.log('should include (reducer) ', action.navigateAfterConnection);
        return result;
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
        var result = Object.assign({}, state, {
          defaultDevice: action.name
        });
        return result;
      case 'Save Device Name To Storage':

        var result = Object.assign({}, state);
        result.allSavedDevices.push(action.deviceName);
        if(result.defaultDevice == null || result.defaultDevice == ""){
          result.defaultDevice = action.deviceName
          AsyncStorage.setItem('defaultDevice', action.deviceName);
          AsyncStorage.setItem(action.deviceName, action.deviceName);
        }
        else {
          AsyncStorage.setItem(action.deviceName, action.deviceName);
        }
        return result
      case 'Scan In Progress':
        var result = Object.assign({}, state, {
          connectedToDevice: "In Progress"
        });
        return result;
      case 'Redirect Is Triggered':
        console.log('Redirect triggered: (also means the nav dispatch)');
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
          result.defaultDevice = 'NULL';
          AsyncStorage.setItem('defaultDevice', "")
        }
        return result
      case 'Not On Splash Page':
        var result = Object.assign({}, state, {
          onSplashPage: false
        });
        if (result.connectedToDevice == 'In Progress') {
          result.connectedToDevice = 'No Connection';
          result.manager.stopDeviceScan();
          // result.manager.cancelDeviceConnection();
        }
        
        return result;
      default:
        state.FROMBLUETOOTh = "FROM BLUETOOTHER"
        return state;
     }
  }


export default BluetoothReducer;
