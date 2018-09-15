import { NavigationActions } from 'react-navigation';
import bluetoothUtil from "./BluetoothUtil";

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
          if (args.deviceBluetoothstate){ // if we have a device name and bluetooth is on try to connect
            if(!args.haveTriedToConnect){
				console.log('trying to connect');
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
			let scannedName = '"'; //forcing splash to not work to test
			// device.name || "";
			if (scannedName.toLowerCase() == args.defaultDevice.toLowerCase()) {  //should be 'raspberrypi'
				console.log('found device');
				bluetoothUtil.saveBluetoothDeviceInformation(args, device);
        	}
      	});
    }
}


export default {
    loadDeviceNamesFromStorage,
    autoConnect
};