import { combineReducers } from 'redux';
import  BluetoothReducer  from './BluetoothReducer.js'
import  NavReducer  from './NavReducer.js'


const AppReducer = combineReducers({
  NavReducer,
  BluetoothReducer
});

export default AppReducer;
