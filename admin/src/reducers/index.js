import { combineReducers } from 'redux';
import admin from './adminReducer';
import auth from './authReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  admin,
  auth,
  routing: routerReducer
});

export default rootReducer;
