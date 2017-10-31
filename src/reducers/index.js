import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { AppNavigator } from '../navigators/AppNavigator';
import { BleManager } from 'react-native-ble-plx';
import  BluetoothReducer  from './BluetoothReducer.js'
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
  switch (action.type) {
    case 'Custom Action':
      nextState = Object.assign({}, state, {
        Custom_Action_KEY: "the customAction created this key"
      })
      break;
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
    console.log(action);
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

// const initialAuthState = { isLoggedIn: false }; //if i change just this to true, i can nav to the home screen showing im logged in, without actually logging in
  // var getDeviceNameFromStorage = AsyncStorage.getItem('savedDeviceName').then((value)=>{
  //     console.log("this is for inistal bluetooth state");
  //     console.log(value);
  //       return value
  //     }).catch((err)=>{
  //       console.log(err);
  //     })
  //
  // var getDeviceNameFromStorage = AsyncStorage.getAllKeys().then((value)=>{
  //     console.log("all saved storagekeys");
  //     console.log(value);
  //       return value
  //     }).catch((err)=>{
  //       console.log(err);
  //     })
  //
  //
  // // const initalBluetoothState = { deviceNameForAutoConnection:  }
  //
  // function bluetoothReducer(state={}, action) {
  //   switch (action.type) {
  //     case 'Save Connection Data':
  //       console.log("save connection data in the reducer");
  //       console.log(action.connectionData);
  //       console.log(state);
  //       return { ...state, ...action.connectionData };
  //     case 'Saving Device Name For Auto Connection':
  //       AsyncStorage.setItem('savedDeviceName', action.deviceName).then(()=>{
  //         return { ...state, ...action.deviceName };
  //       })
  //
  //     default:
  //     console.log(action);
  //     console.log("default ^^");
  //       return state;
  //    }
  // }

const AppReducer = combineReducers({
  nav,
  BluetoothReducer
});

export default AppReducer;
