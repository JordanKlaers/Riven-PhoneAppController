import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';



const firstAction = AppNavigator.router.getActionForPathAndParams('Splash');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);



function NavReducer(state = tempNavState, action) {
  let nextState;
  state.shouldRedirect = true;
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
    case 'Redirect For Bluetooth Connection':
      console.log("gett redirected for bluetooth connection");
      break;

    default:
    // console.log(state);
    // console.log(action.redirectKey);
      nextState = AppNavigator.router.getStateForAction(action, state);
        if(action.redirectKey == true){
          console.log("should redirect becomes false to stop loop");
          nextState.shouldRedirect = false;
        }
      break;
  }
  return nextState || state;
}



export default NavReducer;
