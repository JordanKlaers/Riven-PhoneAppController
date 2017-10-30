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
