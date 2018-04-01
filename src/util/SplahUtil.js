import { NavigationActions } from 'react-navigation';

function bluetoothListener(manager, state, bluetoothState, dispatch, saveBluetoothState) {
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

function loadDeviceNamesFromStorage(deviceStorage, dispatch, defaultDevice, getSavedDeviceNames, setSelectedDevice) {
    deviceStorage.getAllKeys().then((value)=>{
        dispatch(getSavedDeviceNames(value))
        if(value.includes('defaultDevice')){
            deviceStorage.getItem("defaultDevice").then((name)=>{
            // if((defaultDevice != null) && defaultDevice != name){  //currentDeviceName
            name = name || 'NULL';
              dispatch(setSelectedDevice(name))  //currentDeviceName
            // }

          })
        }
      }).catch((err)=>{
  
      })
}

function autoConnect(args) {
    
    if(args.onSplashPage){ //are we still on splash page 
        console.log('splash util - still on splash (onsplashpage)');
        if ((args.deviceBluetoothstate == false || args.defaultDevice == 'NULL') && !args.initializedRedirect) {
            var tempState = Object.assign({}, args.state, {
                initiatedSetTimeout: true,
            });
            args.setState(tempState, ()=>{
                args.forceUpdate();
                args.dispatch({
                type: 'Redirect Is Triggered',
                action: args.dispatch(args.navigate({
                        routeName: 'bluetooth'
                    }))
                })
            })
        }
        else if(args.connectedToDevice == "Connected"){  //are we connected to the device
            if(args.initiatedSetTimeout == false){
                var tempState = Object.assign({}, args.state, {
                    initiatedSetTimeout: true,
                    // onSplashPage: false
                });
                args.setState(tempState, ()=>{
                    args.forceUpdate();
                    setTimeout(()=>{
                        {args.dispatch({
                            type: 'Redirect Is Triggered',
                            action: args.dispatch(args.navigate({
                                routeName: 'controller'
                            }))
                        })}
                    },100);
                })
            }
        }
        else {
          //not connected 
          if (args.deviceBluetoothstate && (args.defaultDevice !=  "" && args.defaultDevice != 'NULL')){ // if we have a device name and bluetooth is on try to connect
            if(!args.haveTriedToConnect){
                args.setState(Object.assign({}, this.state, {
                haveTriedToConnect: true
              }), tryToConnect(args))                   //this function is below
            }
            else {
                if(args.initializedRedirect == false && args.connectedToDevice != "In progress"){
                    var tempState = Object.assign({}, this.state, {
                    initiatedSetTimeout: true,
                    // onSplashPage: false
                    });
                    args.setState(tempState, ()=>{
                        args.forceUpdate();
                        setTimeout(()=>{
                            {args.dispatch({
                                type: 'Redirect Is Triggered',
                                action: args.dispatch(args.navigate({
                                    routeName: 'bluetooth'
                                }))
                            })}
                        },2000);
                    })
                }
            }
          }
        }
      }
}


function pushUpdateState(nextState, state, setState, forceUpdate){
    if(nextState.bluetooth.deviceNameFromStorage != state.defaultDevice){   //update the default device to connect to
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
    console.log('prev: ', state.onSplashPage);
    console.log('nextState: ', nextState.bluetooth.onSplashPage);
    if(nextState.bluetooth.onSplashPage != state.onSplashPage && nextState.bluetooth.onSplashPage != undefined) {
        var tempState = Object.assign({}, state, {
            onSplashPage: nextState.bluetooth.onSplashPage
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
            var temp = Object.assign({}, this.state, {
              connectedToDevice: "In Progress"
            })
            args.setState(temp)
          }
      args.manager.startDeviceScan(null, null, (error, device) => {        
        if (error) {
          return
        }
        if (device.name == args.defaultDevice) {  //should be 'raspberrypi'
          var deviceObject = {};
          args.manager.stopDeviceScan();
          args.manager.connectToDevice(device.id)
          .then((device) => {
            deviceObject = device;
            deviceConnectionInfo.device = device;
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {
            deviceConnectionInfo.deviceID = device.id
            return args.manager.servicesForDevice(device.id)
          })
          .then((services) => {
            var service = null;
            for(let i=0; i<services.length; i++) {
              if(services[i].uuid == "00112233-4455-6677-8899-aabbccddeeff" && service == null){
                service = services[i].uuid
              }
            }
            deviceConnectionInfo.writeServiceUUID = service
            return args.manager.characteristicsForDevice(deviceConnectionInfo.deviceID, deviceConnectionInfo.writeServiceUUID)
          })
          .then((characteristic)=> {
            if (characteristic[0]) {
              deviceConnectionInfo.writeCharacteristicUUID = characteristic[0].uuid
              args.dispatch(args.saveConnectionData(deviceConnectionInfo, deviceObject))
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
    bluetoothListener,
    loadDeviceNamesFromStorage,
    autoConnect,
    pushUpdateState
};