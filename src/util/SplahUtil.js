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

function autoConnect(onSpalshPage, externalDeviceConnectionStatus, deviceBluetoothstate, defaultDevice, haveTriedToConnect, tryToConnect, initializedRedirect, dispatch, navigate, manager, setState, state) {
    if (onSpalshPage) {
        if (deviceBluetoothstate == 'connected' && initializedRedirect == false) {
            return 'redirect';
            // var tempState = Object.assign({}, state, {
            //     initializedRedirect: true
            // });
            // setState(tempState, ()=>{
            //     setTimeout(()=>{
            //       {dispatch({
            //         type: 'Redirect Is Triggered',
            //         action: dispatch(NavigationActions.navigate({
            //           routeName: 'controller'
            //         }))
            //       })}
            //     },2000);
            //   })
        }
        else {
            // return defaultDevice.toString();
            const haveDefaultDevice_BluetoothIsOn = (deviceBluetoothstate != null && defaultDevice !=  "" && deviceBluetoothstate != false && defaultDevice !=  undefined);
            const noName_BluetoothOff = (deviceBluetoothstate == false || defaultDevice == null)
            if (haveDefaultDevice_BluetoothIsOn) {
                return 'bluetooth is on, and we have a  name';
                if (!haveTriedToConnect) {
                    return 'tryToConnect'
                    // setState(Object.assign({}, state, {
                    //     haveTriedToConnect: true
                    // }), tryToConnect(defaultDevice, externalDeviceConnectionStatus, manager))
                }
            }
            else if (noName_BluetoothOff){
                // return 'noName_BluetoothOff';
                var tempState = Object.assign({}, state, {
                    initiatedSetTimeout: true
                });
                setState(tempState, ()=>{
                    setTimeout(()=>{
                      {dispatch({
                        type: 'Redirect Is Triggered',
                        action: dispatch(NavigationActions.navigate({
                          routeName: 'bluetooth'
                        }))
                      })}
                    },2000);
                })
            }
        }
    }
    return "none"
}

export default {
    bluetoothListener,
    loadDeviceNamesFromStorage,
    autoConnect
};