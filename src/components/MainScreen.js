import React from 'react';
import { StyleSheet, View } from 'react-native';

import Splash from './Splash';
import AuthButton from './AuthButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const MainScreen = () => (
  <View style={styles.container}>
    <Splash />
    {/* <AuthButton /> */}
  </View>
);

MainScreen.navigationOptions = {
  title: 'Splash page',
};

export default MainScreen;
