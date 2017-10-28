import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import LoginScreen from '../components/LoginScreen';
import Splash from '../components/Splash';
import ProfileScreen from '../components/ProfileScreen';

export const AppNavigator = StackNavigator({
  Splash: { screen: Splash },
  Login: { screen: LoginScreen },
  Profile: { screen: ProfileScreen },
});

const AppWithNavigationState = ({ dispatch, nav}) => (
  <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav})} />
);

// navigation={addNavigationHelpers({ dispatch, state: nav })}
//^^ add that line into AppNavigator to set up nav with state and stuff, also using the functions below

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  // nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
