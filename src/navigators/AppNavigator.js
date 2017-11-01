import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';
import Splash from '../components/Splash';
import Bluetooth from '../components/Bluetooth';
import Controller from '../components/Controller'


const TabNav = TabNavigator({
    Controller : {
      screen: Controller
    },
    bluetooth: {
      screen: Bluetooth,
    },
  }, {
    tabBarPosition: 'top',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
  });

export const AppNavigator = StackNavigator({
  Splash: { screen: Splash },
  TabNav : { screen: TabNav}

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
  nav: state.NavReducer,
});

export default connect(mapStateToProps)(AppWithNavigationState);
