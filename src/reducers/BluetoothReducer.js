import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

    var manager = new BleManager();
    var bluetoothSubscription = null;
    var bluetooth = {
        manager: manager,
        deviceBluetoothstate: bluetoothSubscription,
        defaultDevice: '',           //currentDeviceName
        connectedToDevice: "No connection",         //false in progress or true for connected
        allSavedDevices: [],         //the key == the device name for all
        deviceObject: {},
		deviceObject: null,
		connectionData: null,
		rerenderCount: 0
    }

function BluetoothReducer(state= bluetooth, action) {
    switch (action.type) {
		case 'increment':
			var temp = Object.assign(
				{}, 
				state,
				{rerenderCount: state.rerenderCount + 1}
			);
			return temp;
      	case 'Save Connection Data':
        	var temp = Object.assign(
				{}, 
				state,
				{ deviceObject: action.deviceObject, connectedToDevice: "Connected" }, 
          		{ connectionData: action.connectionData }
        	);
			return temp;
		case 'Clear Connection Data':
			var temp = Object.assign(
				{}, 
				state, 
				{ deviceObject: null, connectionData: null, connectedToDevice: "no connection" }
			);
			return temp;
    	case 'Save Bluetooth State':
			var temp = Object.assign(
				{},
				state,
				{ deviceBluetoothstate: action.state }
			);
        	return temp;
	  	case 'Save Device Name From Storage':
			var temp = Object.assign(
				{},
				state,
				{ deviceNameFromStorage: action.deviceName }
			);
			return temp;
      	case 'Load Device Names From Storage':
 		    var temp = Object.assign(
				{}, 
				state, 
				{ allSavedDevices: action.devices.filter((name)=> {
            			return name != "defaultDevice"
          			})
				}
			);
        	return temp;
      	case 'Load Default Device From Storage':
	        var temp = Object.assign(
				{}, 
				state, 
				{ defaultDevice: action.name }
			);
			console.log('set to --> ', action.name);
        	return temp;
      	case 'Save Device Name To Storage':
        	var result = Object.assign(
				{}, 
				state
			);
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
      	case 'Scan Status':
			var result = Object.assign(
				{}, 
				state, 
				{ connectedToDevice: action.status}
			);
        	return result;
      	case 'Redirect Is Triggered':
			var result = Object.assign(
				{}, 
				state, 
				{ shouldRedirect: false	}
			);
        	return result;
      	case 'Delete Device Names From Storage':
        	AsyncStorage.removeItem(action.deviceName);
        	var result = Object.assign(
				{}, 
				state,
				{ allSavedDevices: state.allSavedDevices.filter((name)=>{
            			return name != action.deviceName;
          			})
				}
			);
        	if(result.defaultDevice == action.deviceName){
          		result.defaultDevice = null;
          		AsyncStorage.setItem('defaultDevice', "")
        	}
        	return result
      	default:
        	return state;
 	}
}


export default BluetoothReducer;
