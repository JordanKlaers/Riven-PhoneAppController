import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppNavigator } from '../navigators/AppNavigator';

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

// const firstAction = AppNavigator.router.getActionForPathAndParams('Splash');
// const tempNavState = AppNavigator.router.getStateForAction(firstAction);

const ProfileScreen = ({ profileProps, dispatch, navigation}) => {
  // console.log(tempNavState);

  console.log("got props working??", profileProps);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Profile Screen
      </Text>
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
