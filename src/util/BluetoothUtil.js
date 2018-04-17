import { AsyncStorage } from 'react-native';
import { AppNavigator } from '../navigators/AppNavigator';
import { NavigationActions } from 'react-navigation';

function pushUpdateState(args){
	if (args.nextState.bluetooth.count != args.count) {
		var temp = Object.assign({}, args.state, {count: args.nextState.bluetooth.count})
		console.log('???', temp.count);
		args.setState(temp, () => {
			args.forceUpdate();
		})
	}
    // if (args.navigateAfterConnection != args.nextState.bluetooth.navigateAfterConnection) {
    //     var temp = Object.assign({}, args.state, {
    //         navigateAfterConnection: args.nextState.bluetooth.navigateAfterConnections
    //     });
    //     // console.log('updating navigateAfterConnection to:', args.nextState.bluetooth.navigateAfterConnection);
    //     args.setState(temp, ()=>{
    //         args.forceUpdate();
    //     });
    // }
    // if (args.currentView !)
    if(args.deviceObject != args.nextState.bluetooth.deviceObject) {
        var temp = Object.assign({}, args.state, {
            deviceObject: args.nextState.bluetooth.deviceObject
          });
          args.setState(temp, ()=>{
            args.forceUpdate();
          });  
    }
    if(args.nextState.bluetooth.allSavedDevices != args.state.allSavedDevices){
      var temp = Object.assign({}, args.state, {
        allSavedDevices: args.nextState.bluetooth.allSavedDevices
      });
      args.setState(temp, ()=>{
        args.forceUpdate();
      });
    }
    if(args.nextState.bluetooth.defaultDevice != args.state.defaultDevice) {
      var temp = Object.assign({}, args.state, {
        defaultDevice: args.nextState.bluetooth.defaultDevice
      });
      if(!args.state.allSavedDevices.includes(args.nextState.bluetooth.defaultDevice) && args.nextState.bluetooth.defaultDevice != ""){
        temp.allSavedDevices.push(args.nextState.bluetooth.defaultDevice);
      }
      args.setState(temp);
    }
    if(args.nextState.bluetooth.connectedToDevice != args.state.connectedToDevice) {
      var temp = Object.assign({}, this.state, {
        connectedToDevice: args.nextState.bluetooth.connectedToDevice
      });
      args.setState(temp, () => {
        args.forceUpdate();
      });
    }
    // if (args.nextState.waitedForScan != args.state.waitedForScan) {
    //     var temp = Object.assign({}, args.state, {
    //         waitedForScan: args.nextState.waitedForScan
    //     });
    //     args.setState(temp);
    // }

    // if(args.nextState.bluetooth.connectedToDevice == 'In Progress' && !args.state.waitedForScan) {
    //     var temp = Object.assign({}, args.state, {
    //         waitedForScan: true
    //     });
    //     args.setState(temp, ()=>{
    //         setTimeout(()=>{
    //             var temp = Object.assign({}, args.state, {
    //                 connectedToDevice: "no connection"
    //             });
    //             args.setState(temp, ()=>{
    //                 args.manager.stopDeviceScan();
    //             })
    //         },2000)
    //     })
    // }
}

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
    var tempState = Object.assign({}, args.state, {
        allSavedDevices: args.state.allSavedDevices.filter((deviceName)=>{
          return deviceName != args.name;
        })
      })
      args.setState(tempState, ()=> {
        args.dispatch(args.delete(args.name));
      })
}

function selectDefaultDevice(args) {
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
    if(connectToDevice === "In Progress"){
        return connectToDevice;
    }
    else {
        return connectToDevice ?  "Connected" : "No Connection";
    }
}

function tryToConnect(args, name) {
	// if (args.connectedToDevice == "Connected") {
	// 	args.dispatch(args.clearConnectionData());
	// }
    var connectionData = {};
    var haveDispatched = false;
    if(args.connectedToDevice != "Connected"){
        args.manager.startDeviceScan(null, null, (error, device) => {
        	if(args.connectedToDevice != "In Progress"){
				if (!haveDispatched) {
					haveDispatched = true;
					console.log('dispatching scan progress');
					args.dispatch(args.scan())
					setTimeout(() => {
						args.tookToLongToConnect()
					}, 2000);
				}
        	}	
        	if (error) {
          		return
        	}
			console.log('picking pu:', device.name);
        	if (device.name == name) {  //should be 'raspberrypi'
			  	var deviceObject = {};
          		args.manager.stopDeviceScan();
          		args.manager.isDeviceConnected(device.id).then(function ugh(thing) {
             		console.log('already connected?', thing);
          		});
          		args.manager.connectToDevice(device.id)
          		.then((device) => {
              		console.log('1. connected');
            		deviceObject = device;
            		connectionData.device = device;
            		return device.discoverAllServicesAndCharacteristics();
          		})
          		.then((device) => {
              		console.log('2. discovery stuff');
            		connectionData.deviceID = device.id
            		return args.manager.servicesForDevice(device.id)
          		})
          		.then((services) => {
              		console.log('3. service stuff');
            		var service = null;
            		for(let i=0; i<services.length; i++) {
              			if(services[i].uuid == "00112233-4455-6677-8899-aabbccddeeff" && service == null){
                  			console.log('found the service uuid');
                			service = services[i].uuid
              			}
            		}
            		connectionData.writeServiceUUID = service
            		return args.manager.characteristicsForDevice(connectionData.deviceID, connectionData.writeServiceUUID)
          		})
          		.then((characteristic)=> {
            		if (characteristic[0]) {
                		connectionData.writeCharacteristicUUID = characteristic[0].uuid
                		// let connectionData = connectionData;
                		let navigateAfterConnection = true

                		// console.log('COPYTHIS: ', args.saveConnectionData(connectionData, deviceObject, navigateAfterConnection));
                		args.dispatch({
                    		type: 'Save Connection Data', 
                    		connectionData, 
                    		deviceObject, 
                    		navigateAfterConnection
                    		// action: args.dispatch(NavigationActions.navigate({routeName: 'controller'}))
						})
            		}
            		else {
              			console.log("retrieving connection data failed when pairing with the device");
            		}
          		},
          		(error) => {

          		});
        	}
      	});
    }
}

export default {
    pushUpdateState,
    updateText,
    saveNewDevice,
    removeDevice,
    selectDefaultDevice,
    connectionStatus,
    tryToConnect
};