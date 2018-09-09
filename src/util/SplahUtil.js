import { NavigationActions } from 'react-navigation';
import bluetoothUtil from "./BluetoothUtil";
// function bluetoothListener(manager, state, bluetoothState, dispatch, saveBluetoothState) {
//     manager.onStateChange((deviceBluetoothstate) => {
//         if (deviceBluetoothstate === 'PoweredOn') {
//           if(bluetoothState == false || bluetoothState == null){
// 			bluetoothState = true;
//             dispatch(saveBluetoothState(bluetoothState))
//           }
//         }
//         else {
//           if(bluetoothState == true || bluetoothState == null){
// 			bluetoothState = false;
//             dispatch(saveBluetoothState(bluetoothState))
//           }
//         }
//       }, true);
// };

function loadDeviceNamesFromStorage(deviceStorage, dispatch, defaultDevice, getSavedDeviceNames, setSelectedDevice) {

    deviceStorage.getAllKeys().then((value)=>{
		dispatch(getSavedDeviceNames(value))
        if(value.includes('defaultDevice')){
            deviceStorage.getItem("defaultDevice").then((name)=>{
			name = name || "";
              dispatch(setSelectedDevice(name))
          })
		}
		else {
			dispatch(setSelectedDevice(null))
		}
      }).catch((err)=>{
  
      })
}

function autoConnect(args) {
    if(args.currentView == 0){ //are we still on splash page 
        if (args.deviceBluetoothstate == false || args.defaultDevice == null) {
            args.dispatch(args.navigate({
                routeName: 'bluetooth'
            }))
        }
		else if(args.connectedToDevice == "Connected" && args.currentView == 0){  //are we connected to the device
            args.dispatch({
                type: 'Redirect Is Triggered',
                action: args.dispatch(args.navigate({
                    routeName: 'controller'
                }))
            })
        }
        else {
          //not connected 
          if (args.deviceBluetoothstate && (args.defaultDevice !=  "")){ // if we have a device name and bluetooth is on try to connect
            if(!args.haveTriedToConnect){
                args.setState(Object.assign({}, this.state, {
                haveTriedToConnect: true
              }), tryToConnect(args))                   //this function is below
            }
            else {
                if(args.connectedToDevice != "In progress"){
                    setTimeout(()=>{
                        args.tookToLongToConnect();
                    },3000);
                }
            }
          }
        }
    }
}


function pushUpdateState(nextState, state, setState, forceUpdate){
	if(nextState.bluetooth.defaultDevice != state.defaultDevice){   //update the default device to connect to
		console.log('next and current differ for bluetooth state', nextState.bluetooth.defaultDevice);
        var tempState = Object.assign({}, state, {
          defaultDevice: nextState.bluetooth.defaultDevice    
        });
        setState(tempState)
    }
    if(nextState.bluetooth.deviceBluetoothstate != state.deviceBluetoothstate){ //update the bluetoothstate
        var tempState = Object.assign({}, state, {
          deviceBluetoothstate: nextState.bluetooth.deviceBluetoothstate
        });
        setState(tempState)
    }
    if(nextState.bluetooth.connectedToDevice != state.connectedToDevice){ // update statu of connection to external device
        var tempState = Object.assign({}, state, {
            connectedToDevice: nextState.bluetooth.connectedToDevice
        });
        setState(tempState)
    }
    if(nextState.myNav.index != state.currentView) {
        var tempState = Object.assign({}, state, {
            currentView: nextState.myNav.index
        });
        
        setState(tempState, () => {
            forceUpdate()
        })
    }
}

function tryToConnect(args) {
    var deviceConnectionInfo = {};
    if(args.connectedToDevice != "Connected"){
        if(args.connectedToDevice != "In Progress"){
            args.dispatch(args.scanInProgress())
        }
      	args.manager.startDeviceScan(null, null, (error, device) => {        
        	if (error) {
          		return
			}
			// console.log('device name: ', device.name);
			let scannedName = device.name || "";
			if (scannedName.toLowerCase() == args.defaultDevice.toLowerCase()) {  //should be 'raspberrypi'
				console.log('found device');
				bluetoothUtil.saveBluetoothDeviceInformation(args, device);
        	}
      	});
    }
}


export default {
    // bluetoothListener,
    loadDeviceNamesFromStorage,
    autoConnect,
    pushUpdateState
};