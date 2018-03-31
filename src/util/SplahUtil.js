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
            if(defaultDevice != name){  //currentDeviceName
              dispatch(setSelectedDevice(name))  //currentDeviceName
            }
          })
        }
      }).catch((err)=>{
  
      })
}

function autoConnect(onSpalshPage, externalDeviceConnectionStatus, deviceBluetoothstate, defaultDevice, haveTriedToConnect, tryToConnect, initializedRedirect, dispatch, navigate, manager, setState) {
    if (onSpalshPage) {
        if (deviceBluetoothstate == 'connected' && initializedRedirect == false) {
            var tempState = Object.assign({}, this.state, {
                initializedRedirect: true
            });
            setState(tempState, ()=>{
                setTimeout(()=>{
                  {dispatch({
                    type: 'Redirect Is Triggered',
                    action: dispatch(navigate({
                      routeName: 'controller'
                    }))
                  })}
                },2000);
              })
        }
        else {
            const haveDefaultDevice_BluetoothIsOn = (deviceBluetoothstate != null && defaultDevice !=  "" && deviceBluetoothstate != false && defaultDevice !=  undefined);
            const noName_BluetoothOff = (deviceBluetoothstate == false || defaultDevice == null)
            if (haveDefaultDevice_BluetoothIsOn) {
                if (!haveTriedToConnect) {
                    setState(Object.assign({}, this.state, {
                        haveTriedToConnect: true
                    }), tryToConnect(defaultDevice, externalDeviceConnectionStatus, manager))
                }
            }
            else if (noName_BluetoothOff){
                var tempState = Object.assign({}, this.state, {
                    initiatedSetTimeout: true
                });
                setState(tempState, ()=>{
                    setTimeout(()=>{
                      {dispatch({
                        type: 'Redirect Is Triggered',
                        action: dispatch(navigate({
                          routeName: 'bluetooth'
                        }))
                      })}
                    },2000);
                })
            }
        }
    }
}

export default {
    bluetoothListener,
    loadDeviceNamesFromStorage,
    autoConnect
};