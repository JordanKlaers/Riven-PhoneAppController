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



const ProfileScreen = ({ profileProps, dispatch, navigation}) => {
  // console.log(tempNavState);
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
  
console.log(profileProps.bluetoothReducer);
var text= "placeholder"
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Profile Screen
      </Text>
      <Button onPress={()=> dispatch(customAction())} title="execute custom action" />
      <TextInput
       style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
       onChangeText={async (value) => {
         console.log(value);
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

ProfileScreen.propTypes = {
  // isLoggedIn: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

ProfileScreen.navigationOptions = {
  title: 'Profile',
};

const mapStateToProps = state => ({
  profileProps: state,
});

export default connect(mapStateToProps)(ProfileScreen);
