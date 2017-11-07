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



const Controller = ({ Props, dispatch, navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Controller Screen
      </Text>
      <Button onPress={()=> dispatch(customAction())} title="execute custom action" />
      <TextInput
       style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
       
     />
    </View>
  )
};

Controller.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Controller.navigationOptions = {
  header: null
};

const mapStateToProps = state => ({
  Props: state,
});

export default connect(mapStateToProps)(Controller);
