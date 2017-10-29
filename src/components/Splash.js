import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

const myProps = ({ myProps, dispatch, navigation}) => {
  console.log(myProps.nav.manager);
  console.log("whats that ^^^^");
  var manager = myProps.nav.manager
  const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          console.log("PoweredOn");
            // this.tempState.bluetoothState = "on";
            // this.setState(this.tempState);
            scanAndConnect();
            // subscription.remove();
        }
        else {
          // this.tempState.bluetoothState = "off";
          // this.setState(this.tempState);
          console.log("bluetooth not on");
        }
    }, true);
  
  var scanAndConnect = () => {
    console.log("scanning?");
    manager.startDeviceScan(null, null, (error, device) => {
      console.log(device);
        if (error) {
            return
        }
        if (device.name === 'raspberrypi') {
            manager.stopDeviceScan();

            manager.connectToDevice(device.id)
                .then((device) => {
                  // this.tempState.device = device;
                  return device.discoverAllServicesAndCharacteristics();
                })
                .then((device) => {
                  // this.tempState.deviceID = device.id
                  return manager.servicesForDevice(device.id)
                })
                .then((services) => {
                  console.log(services);
                  // this.tempState.writeServiceUUID = services[2].uuid
                  // this.tempState.deviceConnection = "Connected!!"
                  console.log("connected");
                  return manager.characteristicsForDevice(this.tempState.deviceID, this.tempState.writeServiceUUID)
                }).then((characteristic)=> {
                  console.log(characteristic);
                  // this.tempState.writeCharacteristicUUID = characteristic[0].uuid
                  // this.setState(this.tempState, ()=> {})
                }, (error) => {
                  console.log(error);
                });
        }
    });
  }

  return (
    <View>
      <Text style={styles.welcome}>
        {'twentyfive dogs and a cat'}
        {}
      </Text>
      <Button
        onPress={() => {
          // console.log("go to profile ay ----------------------------------------------------------");

          dispatch(NavigationActions.navigate({ routeName: 'Profile'}))}
        }
        title="I dont like that ^^ take me somewhere else"
      />
    </View>
  );
};

myProps.propTypes = {
  // isLoggedIn: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

// const mapDispatchToProps = dispatch => ({
//
//   toProfile: () =>
//     dispatch(NavigationActions.navigate({ routeName: 'Profile' })),
// });

const mapStateToProps = state => ({
  myProps: state,
  manager: state.manager
});

export default connect(mapStateToProps)(myProps);
