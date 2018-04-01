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
    if(args.redirectBool){ //are we still on splash page
        if ((args.deviceBluetoothstate == false || args.defaultDevice == 'NULL') && !args.initializedRedirect) {
          var tempState = Object.assign({}, args.state, {
            initiatedSetTimeout: true
          });
          args.setState(tempState, ()=>{
            setTimeout(()=>{
              {args.dispatch({
                type: 'Redirect Is Triggered',
                action: args.dispatch(args.navigate({
                  routeName: 'bluetooth'
                }))
              })}
            },10);
          })
        }
        // else if(deviceBluetoothstate && (defaultDevice != '' || defaultDevice != 'NULL') && (connectedToDevice != "Connected")){
  
        // } 
        else if(args.connectedToDevice == "Connected"){  //are we connected to the device
          if(args.initiatedSetTimeout == false){
            var tempState = Object.assign({}, args.state, {
              initiatedSetTimeout: true
            });
            args.setState(tempState, ()=>{
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
              }), args.tryToConnect(args.defaultDevice, args.connectedToDevice, args.manager))
            }
            else {
              if(args.initializedRedirect == false && args.connectedToDevice != "In progress"){
                var tempState = Object.assign({}, this.state, {
                  initiatedSetTimeout: true
                });
                args.setState(tempState, ()=>{
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

export default {
    bluetoothListener,
    loadDeviceNamesFromStorage,
    autoConnect
};