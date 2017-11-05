import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';



const thisfirstAction = AppNavigator.router.getActionForPathAndParams('Splash');
const thisOne = AppNavigator.router.getStateForAction(thisfirstAction);


function NavReducer(state = thisOne, action) {

  let nextState;
  switch (action.type) {
    case 'Custom Action':
    console.log("hit customAction");
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
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }
  return nextState || state;
}



export default NavReducer;
