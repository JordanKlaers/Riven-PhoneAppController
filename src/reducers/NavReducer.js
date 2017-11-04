import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';



const thisfirstAction = AppNavigator.router.getActionForPathAndParams('Splash');
const thisOne = AppNavigator.router.getStateForAction(thisfirstAction);


function NavReducer(state = thisOne, action) {

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
    case 'Redirect Is Triggered':
      console.log("what the heck why no triggered?");
      nextState = AppNavigator.router.getStateForAction(action, state);
      nextState.shouldRedirect = false;
      break;

    default:
    // console.log("does old state show shouldRedirect as false");
    // // console.log(action);
    // console.log(state);
      nextState = AppNavigator.router.getStateForAction(action, state);
      nextState.FROMNAv = "FROM NAV"
      //   if(action.redirectKey == true){
      //     // console.log("onlyRedirectOnce----------");
      //     // console.log(state);
      //     nextState.shouldRedirect = false;
      //   }
      break;
  }
  return nextState || state;
}



export default NavReducer;
