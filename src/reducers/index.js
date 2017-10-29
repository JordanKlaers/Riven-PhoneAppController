import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';
import { BleManager } from 'react-native-ble-plx';
// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('Splash');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
// const secondAction = AppNavigator.router.getActionForPathAndParams('Profile');
const initialNavState = AppNavigator.router.getStateForAction(
  tempNavState,

);
tempNavState.manager = new BleManager();

function nav(state = tempNavState, action) {
  let nextState;
  state.myExtraBoop = "extra boop"
  // console.log(action);
  switch (action.routeName) {
    // case 'Login':
    //   nextState = AppNavigator.router.getStateForAction(
    //     NavigationActions.back(),
    //     state
    //   );
    //   break;
    case 'ProfileScreen':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Splash'}),
        state
      );
      break;
    // case 'Logout':
    //   nextState = AppNavigator.router.getStateForAction(
    //     NavigationActions.navigate({ routeName: 'Login' }),
    //     state
    //   );
    //   break;
    default:
    // console.log("---------------------this is action type from reducers-------------------------");
    // console.log(action.type);
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

// const initialAuthState = { isLoggedIn: false }; //if i change just this to true, i can nav to the home screen showing im logged in, without actually logging in
//
// function auth(state = initialAuthState, action) {
//   switch (action.type) {
//     case 'Login':
//       return { ...state, isLoggedIn: true };
//     case 'Logout':
//       return { ...state, isLoggedIn: false };
//     default:
//       return state;
//   }
// }

const AppReducer = combineReducers({
  nav,

});

export default AppReducer;
