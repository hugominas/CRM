import { combineReducers } from 'redux';
import admin from './adminReducer';
import auth from './authReducer';
import {routerReducer} from 'react-router-redux';
import {reducer as toastrReducer} from 'react-redux-toastr'

const rootReducer = combineReducers({
  admin,
  auth,
  toastr: toastrReducer,
  routing: routerReducer
});

export default rootReducer;
