import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';



const thisfirstAction = AppNavigator.router.getActionForPathAndParams('Splash');
const thisOne = AppNavigator.router.getStateForAction(thisfirstAction);


function NavReducer(state = thisOne, action) {

  let nextState;
  switch (action.routeName) {
    case 'bluetooth':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'bluetooth'}),
        state
      );
      break;
    case 'controller':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'controller'}),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }
  return nextState || state;
}



export default NavReducer;
