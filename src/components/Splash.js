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
  console.log("Props from splash page");
  console.log(myProps);
  return (
    <View>
      <Text style={styles.welcome}>
        {'You are "I messed with this whole file and the reducers for auth" right now'}
        {}
      </Text>
      <Button
        onPress={() => {
          // console.log("go to profile ay ----------------------------------------------------------");
        
          dispatch(NavigationActions.navigate({ routeName: 'Profile'}))}
        }
        title="Profile"
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
});

export default connect(mapStateToProps)(myProps);
