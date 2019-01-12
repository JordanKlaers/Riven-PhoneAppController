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
    if(args.state.textInput != "" && !args.allSavedDevices.includes(args.state.textInput)) {
        args.dispatch(args.save(args.state.textInput))
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
			// console.log(scannedName);
			if (scannedName.toLowerCase() == name.toLowerCase()) {  //should be 'raspberrypi'
			console.log('found it');
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
		console.log('device ->', device);
		connectionData.deviceID = device.id
		return args.manager.servicesForDevice(device.id);
	})
	.then((services) => {              		
		var service = null;
		
		for(let i=0; i< services.length; i++) {
			console.log(`service-${i} `, services[i].uuid);
			if(services[i].uuid == "6e400001-b5a3-f393-e0a9-e50e24dcca9e" && service == null){
			// 0000ffe0-0000-1000-8000-00805f9b34fb  -- WAS FOR THE hm10
				service = services[i].uuid;
			}
		}
		connectionData.writeServiceUUID = service
		return args.manager.characteristicsForDevice(connectionData.deviceID, connectionData.writeServiceUUID)
		})
	.then((characteristic)=> {
		console.log('characteristics', characteristic[1].uuid);
		if (characteristic[1]) {
			connectionData.writeCharacteristicUUID = characteristic[1].uuid
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