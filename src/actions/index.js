export const TestAction = (count) => {
  console.log('inside action that is a problem');
  return {
    type: 'Test Action',
    value: count
  }
}

export const saveConnectionData = (connectionData, deviceObject, navigateAfterConnection) => {
  console.log('only once: (inside action)', navigateAfterConnection);
  return {
    type: 'Save Connection Data',
    connectionData,
    deviceObject,
    navigateAfterConnection
  }
}

export const clearConnectionData = () => {
	return {
		type: 'Clear Connection Data'
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



export const scanInProgress = (status = 'In Progress') => {
  return {
    type: 'Scan Status',
    status: status
  }
}

