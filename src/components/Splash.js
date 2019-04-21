import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableHighlight, Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  saveConnectionData,
  saveBluetoothState,
  saveDeviceNameFROMStorage,   //currentDeviceName
  onlyRedirectOnce,
  redirectForBluetoothConnection,
  scanInProgress,
  connected,
  getSavedDeviceNames,
  setSelectedDevice,
} from '../actions'
import { AsyncStorage } from 'react-native';
import SplashUtil from '../util/SplahUtil.js';
import BluetoothUtil from '../util/BluetoothUtil.js';

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
      manager: props.bluetooth.manager,
      currentBluetoothState: props.bluetooth.subscription || null,
      defaultDevice: props.bluetooth.defaultDevice,
      dispatch: props.navigation.dispatch,
      connectedToDevice: props.bluetooth.connectedToDevice,
      dimensions: {},
      haveTriedToConnect: false,
      deviceObject: props.bluetooth.deviceObject,
      currentView: props.myNav.index
    }
  }

  componentWillMount() {
    BluetoothUtil.bluetoothListener(this.props.bluetooth.manager, this.props.bluetooth.subscription, this.props.navigation.dispatch, saveBluetoothState);
    SplashUtil.loadDeviceNamesFromStorage(AsyncStorage, this.state.dispatch, this.state.defaultDevice, getSavedDeviceNames, setSelectedDevice)
  }

	componentDidUpdate(state){
    	var args = {
    		currentView: this.props.myNav.index,
      		deviceBluetoothstate: this.props.bluetooth.deviceBluetoothstate,
      		defaultDevice: this.props.bluetooth.defaultDevice,
      		setState: this.setState,
      		dispatch: this.props.navigation.dispatch,
      		navigate: NavigationActions.navigate,
      		connectedToDevice: this.props.bluetooth.connectedToDevice,
      		haveTriedToConnect: this.state.haveTriedToConnect,
      		tryToConnect: this.tryToConnect,
      		manager: this.props.bluetooth.manager,
      		state: this.state,
      		scanInProgress: scanInProgress,
      		saveConnectionData: saveConnectionData,
      		forceUpdate: this.forceUpdate,
      		tookToLongToConnect: this.tookToLongToConnect
		}
		if (args.defaultDevice) {
			SplashUtil.autoConnect(args);
		}
  	}

  tookToLongToConnect = (currentView = this.props.myNav.index) => {
    if (currentView == 0) {
      this.state.dispatch(NavigationActions.navigate({
            routeName: 'bluetooth'
      }))
    }
  }

  navigationOptions = {
    header: null
  }


  render() {
    return (
      <View>
        <Text style={{margin: '40%'}}>{this.props.bluetooth.connectedToDevice}</Text>
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
