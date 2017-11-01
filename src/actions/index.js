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
