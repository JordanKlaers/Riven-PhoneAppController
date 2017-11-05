import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppNavigator } from '../navigators/AppNavigator';
import { customAction } from '../actions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});



const Bluetooth = ({ Props, dispatch, navigation}) => {
  // console.log(Props);
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Bluetooth Settings
      </Text>
      <Text>
        Save device name for auto connection
      </Text>
      <TextInput
       style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
       onChangeText={async (value) => {
          try {
            await AsyncStorage.setItem('savedDeviceName', value);
          } catch (error) {
            console.log(error);
          }
       }}
     />
    </View>
  )
};

Bluetooth.navigationOptions = {
  title: 'Bluetooth',
  header: null
};

const mapStateToProps = state => ({
  Props: state,
});

export default connect(mapStateToProps)(Bluetooth);
