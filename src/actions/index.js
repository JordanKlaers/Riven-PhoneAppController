export const customAction = () => {
  return {
    type: 'Custom Action'
  }
}

export const saveConnectionData = (connectionData, deviceObject) => {
  return {
    type: 'Save Connection Data',
    connectionData,
    deviceObject
  }
}

export const saveBluetoothState = (state) => {
  return {
    type: 'Save Bluetooth State',
    state
  }
}

export const saveDeviceNameFROMStorage = (deviceName) => { //replaced by the one below
  return {
    type: 'Save Device Name From Storage',
    deviceName
  }
}

export const getSavedDeviceNames = ( devices ) =>{
  return {
    type: 'Load Device Names From Storage',
    devices
  }
}

export const saveDeviceNameTOStorage = (deviceName) => {
  return {
    type: 'Save Device Name To Storage',
    deviceName
  }
}

export const deleteDeviceNameFromStorage = ( deviceName ) =>{
  return {
    type: 'Delete Device Names From Storage',
    deviceName
  }
}

export const redirectForBluetoothConnection = (state) => {
  return {
    type: 'Redirect For Bluetooth Connection',
    state
  }
}

export const setSelectedDevice = (name) => {
  return {
    type: 'Load Default Device From Storage',
    name
  }
}

// export const setDefaultDevice = (name) => {
//   return {
//     type: 'Set Default Device',
//     name
//   }
// }

export const scanInProgress = () => {
  return {
    type: 'Scan In Progress',
  }
}

export const triggered = (state) => {
  return {
    type: 'Redirect Is Triggered',
    state
  }
}

export const notOnSplashPage = () => {
  return {
    type: 'Not On Splash Page'
  }
}
