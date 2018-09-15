import { AsyncStorage } from 'react-native';
import { AppNavigator } from '../navigators/AppNavigator';
import { NavigationActions } from 'react-navigation';

function bluetoothListener(manager, bluetoothState, dispatch, saveBluetoothState) {
    manager.onStateChange((deviceBluetoothstate) => {
        if (deviceBluetoothstate === 'PoweredOn') {
          	if(bluetoothState == false || bluetoothState == null){
				bluetoothState = true;
            	dispatch(saveBluetoothState(bluetoothState))
          	}
        }
        else {
          	if(bluetoothState == true || bluetoothState == null){
				bluetoothState = false;
            	dispatch(saveBluetoothState(bluetoothState))
    		}
        }
    }, true);
};




function updateText(args) {
    var tempState = Object.assign({}, args.state, {
        textInput: args.input
    });
    args.setState(tempState);
}

function saveNewDevice(args){
    if(args.state.textInput != "" && !args.state.allSavedDevices.includes(args.state.textInput.toLowerCase().replace(/\s+/g, ''))) {
        args.dispatch(args.save(args.state.textInput.toLowerCase().replace(/\s+/g, '')))
    }
}

function removeDevice(args) {
	args.dispatch(args.delete(args.name));
}

function selectDefaultDevice(args) {
	console.log('selected this name_>', args.name);
    AsyncStorage.setItem('defaultDevice', args.name)
	args.dispatch(args.set(args.name))
	if (args.deviceObject && args.deviceObject.hasOwnProperty('id')) {
		args.manager.cancelDeviceConnection(args.deviceObject.id)
		.then(() => {
		  // Success code
		  console.log('Disconnected');
		})
		.catch((error) => {
		  // Failure code
		  console.log('failed to disconnected');
		  console.log(error);
		});
	}
	args.dispatch(args.clearConnectionData())
    args.tryToConnect(args.name);
}

function connectionStatus(connectToDevice) {
	console.log('props status', connectToDevice);
    if(connectToDevice === "In Progress"){
        return connectToDevice;
    }
    else {
        return connectToDevice ?  "Connected" : "No Connection";
    }
}

function tryToConnect(args, name) {
	var haveDispatched = false;
    if(args.connectedToDevice != "Connected"){
        args.manager.startDeviceScan(null, null, (error, device) => {
        	if(args.connectedToDevice != "In Progress") {
				if (!haveDispatched) {
					haveDispatched = true;
					args.dispatch(args.scan())
					setTimeout(() => {
						args.tookToLongToConnect()
					}, 5000);
				}
        	}	
        	if (error) {
          		return
			}
			let scannedName = device.name || "";
			if (scannedName.toLowerCase() == name.toLowerCase()) {  //should be 'raspberrypi'
				saveBluetoothDeviceInformation(args, device);
        	}
      	});
    }
}

function saveBluetoothDeviceInformation(args, device) {
	var deviceObject = {};
	var connectionData = {};
	args.manager.stopDeviceScan();
    args.manager.connectToDevice(device.id)
	.then((device) => {
		deviceObject = device;
		connectionData.device = device;
		return device.discoverAllServicesAndCharacteristics();
	})
	.then((device) => {
		connectionData.deviceID = device.id
		return args.manager.servicesForDevice(device.id);
	})
	.then((services) => {              		
		var service = null;
		for(let i=0; i<services.length; i++) {
			if(services[i].uuid == "0000ffe0-0000-1000-8000-00805f9b34fb" && service == null){
				service = services[i].uuid;
			}
		}
		connectionData.writeServiceUUID = service
		return args.manager.characteristicsForDevice(connectionData.deviceID, connectionData.writeServiceUUID)
		})
	.then((characteristic)=> {
		if (characteristic[0]) {
			connectionData.writeCharacteristicUUID = characteristic[0].uuid
			args.dispatch({
				type: 'Save Connection Data', 
				connectionData, 
				deviceObject
			})
		}
		else {
			console.log("retrieving connection data failed when pairing with the device");
		}
	},
	(error) => {

	});
}

export default {
    updateText,
    saveNewDevice,
    removeDevice,
    selectDefaultDevice,
    connectionStatus,
	tryToConnect,
	bluetoothListener,
	saveBluetoothDeviceInformation
};