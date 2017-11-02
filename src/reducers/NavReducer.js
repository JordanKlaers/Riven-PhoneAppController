import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';



const firstAction = AppNavigator.router.getActionForPathAndParams('Splash');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);



function NavReducer(state = tempNavState, action) {
  let nextState;
  state.myExtraBoop = "extra boop"
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
    default:
    console.log("nav reducer default");
    console.log(state);
    console.log(action);
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }
  return nextState || state;
}



export default NavReducer;
