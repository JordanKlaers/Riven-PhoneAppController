import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';



const thisfirstAction = AppNavigator.router.getActionForPathAndParams('Splash');
const thisOne = AppNavigator.router.getStateForAction(thisfirstAction);


function NavReducer(state = thisOne, action) {

  let nextState;
  switch (action.type) {
    case 'ProfileScreen':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Splash'}),
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
