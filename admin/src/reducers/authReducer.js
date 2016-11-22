import {AUTH_USER, LOGOUT_USER, INCORRECT_USER} from '../actions/actionTypes';
//import calculator from '../utils/fuelSavingsCalculator';
import objectAssign from 'object-assign';
import initialState from './initialState';

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function leadsReducer(state = initialState.auth, action) {
  let newState;

  switch (action.type) {
    case LOGOUT_USER:

      if(action.result === 'OK'){
        return objectAssign({}, state, {login: ''});
        //window.location.reload();
      }else{
        return state;
        //window.location.reload();
      }
    case INCORRECT_USER:

      if(action.result === 'NOK'){
        return objectAssign({}, state, {valid: 'NOK'});
        //window.location.reload();
      }else{
        return state;
        //window.location.reload();
      }


    case AUTH_USER:

      if(action.result === 'OK'){
        localStorage.login = Date.now();
        //window.location="/admin";
        return objectAssign({}, state, {login: 'OK'});
      }

    default:
      return state;
  }
}
