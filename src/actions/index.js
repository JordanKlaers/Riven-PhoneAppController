export const customAction = () => {
  return {
    type: 'Custom Action'
  }
}

export const saveConnectionData = (connectionData) => {
  return {
    type: 'Save Connection Data',
    connectionData
  }
}

export const saveBluetoothState = (state) => {
  return {
    type: 'Save Bluetooth State',
    state
  }
}

export const saveDeviceNameFROMStorage = (deviceName) => {
  return {
    type: 'Save Device Name From Storage',
    deviceName
  }
}

export const saveDeviceNameTOStorage = (deviceName) => {
  return {
    type: 'Save Device Name To Storage',
    deviceName
  }
}

export const redirectForBluetoothConnection = (state) => {
  return {
    type: 'Redirect For Bluetooth Connection',
    state
  }
}

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
