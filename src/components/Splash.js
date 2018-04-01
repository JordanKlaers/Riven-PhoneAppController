import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  saveConnectionData,
  saveBluetoothState,
  saveDeviceNameFROMStorage,   //currentDeviceName
  onlyRedirectOnce,
  redirectForBluetoothConnection,
  scanInProgress,
  connected,
  triggered,
  getSavedDeviceNames,
  setSelectedDevice
} from '../actions'
import { AsyncStorage } from 'react-native';
import SplashUtil from '../util/SplahUtil.js';

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});


class Splash extends Component {

  constructor(props) {
    super(props)
    this.setState = this.setState.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.state = {                      //should be just the ones that i need to worry about changing
      onSplashPage: props.bluetooth.onSplashPage,
      manager: props.bluetooth.manager,
      currentBluetoothState: props.bluetooth.subscription || null,
      defaultDevice: props.bluetooth.defaultDevice,
      dispatch: props.navigation.dispatch,
      initiatedSetTimeout: false,
      connectedToDevice: props.bluetooth.connectedToDevice,
      dimensions: {},
      haveTriedToConnect: false,
      alldevices: props.bluetooth.allSavedDevices
    }
  }

  componentWillMount(){
    SplashUtil.bluetoothListener(this.state.manager, this.state, this.state.currentBluetoothState, this.state.dispatch, saveBluetoothState);
    SplashUtil.loadDeviceNamesFromStorage(AsyncStorage, this.state.dispatch, this.state.defaultDevice, getSavedDeviceNames, setSelectedDevice)

  }

  componentDidUpdate(state){
    var args ={
      onSplashPage: this.state.onSplashPage,
      deviceBluetoothstate: this.state.deviceBluetoothstate,
      defaultDevice: this.state.defaultDevice,
      initializedRedirect: this.state.initiatedSetTimeout,
      setState: this.setState,
      dispatch: this.state.dispatch,
      navigate: NavigationActions.navigate,
      connectedToDevice: this.state.connectedToDevice,
      haveTriedToConnect: this.state.haveTriedToConnect,
      tryToConnect: this.tryToConnect,
      manager: this.state.manager,
      state: this.state,
      scanInProgress: scanInProgress,
      saveConnectionData: saveConnectionData,
      forceUpdate: this.forceUpdate
    }

    SplashUtil.autoConnect(args);
  }

  componentWillReceiveProps(nextState){
    SplashUtil.pushUpdateState(nextState, this.state, this.setState, this.forceUpdate);
  }

  navigationOptions = {
    header: null
  }


  render() {
    return (
      <View>
        <Text style={{margin: '40%'}}>{this.state.connectedToDevice}</Text>
        <Text>{this.state.scannedDeviceName}</Text>
      </View>
    );
  }
}

Splash.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
Splash.navigationOptions = {
  header: null
}

const mapStateToProps = state => ({
  myNav: state.NavReducer,
  bluetooth: state.BluetoothReducer
});

export default connect(mapStateToProps)(Splash);
