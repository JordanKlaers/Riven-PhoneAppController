import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { saveConnectionData } from '../actions'
import { AsyncStorage } from 'react-native';

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

const myProps = ({ myProps, dispatch, navigation}) => {

  AsyncStorage.getItem('savedDeviceName').then((value)=>{
    if (value !== null){
      // We have data!!
      console.log("retried storage correctly");
      console.log(value);
    }
  }).catch((error) => {
    // Error retrieving data
    console.log("error with storage");
  })

  var manager = myProps.nav.manager
  var tempState = {};
  const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          // console.log("PoweredOn");
          // console.log(myProps);

            scanAndConnect();
            // subscription.remove();
        }
        else {
          console.log("bluetooth not on");
        }
    }, true);

  var scanAndConnect = () => {

    manager.startDeviceScan(null, null, (error, device) => {

        if (error) {
            return
        }
        if (device.name === 'raspberrypi') {
            manager.stopDeviceScan();

            manager.connectToDevice(device.id)
                .then((device) => {
                  tempState.device = device;
                  return device.discoverAllServicesAndCharacteristics();
                })
                .then((device) => {
                  tempState.deviceID = device.id
                  return manager.servicesForDevice(device.id)
                })
                .then((services) => {

                  tempState.writeServiceUUID = services[2].uuid

                  return manager.characteristicsForDevice(tempState.deviceID, tempState.writeServiceUUID)
                }).then((characteristic)=> {

                  tempState.writeCharacteristicUUID = characteristic[0].uuid
                  dispatch(saveConnectionData(tempState))
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
