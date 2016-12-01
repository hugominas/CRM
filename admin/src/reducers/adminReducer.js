import {UPDATE_DATA, UPDATE_DATE, DELETE_DATA, UPDATE_SELECTOR, UPDATE_DATA_SINGLE, UPDATE_FORM, UPDATE_PAGER} from '../actions/actionTypes';
//import calculator from '../utils/fuelSavingsCalculator';
import objectAssign from 'object-assign';
import initialState from './initialState';

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function adminReducer(state = initialState.admin, action) {
  let newState;

  switch (action.type) {
    case UPDATE_DATA:
      newState = objectAssign({}, state);
      //MAKE THE CHANGES
      newState.data[action.what] = action.result.data.data;
      return newState;

      break;
    case UPDATE_DATA_SINGLE:
      //MAKE THE CHANGES
      return objectAssign({}, state, {[action.what]: action.result.data.data[0]});

      break;
      case UPDATE_FORM:
        //Update individual details
        let inerchange = objectAssign({}, state[action.what], {[action.name]:action.value})
        return objectAssign({}, state, {[action.what]:inerchange});

      break;
      case UPDATE_PAGER:
        let thisDate = new Date()

        return {... state, pager: action.pager}
      break;
      case DELETE_DATA:

      return {
         ...state,
         data : {
             ...state.data,
             [action.what] : state.data[action.what].filter((ele)=>{return (ele._id!=action.id)})
         }
       }
      break;

    default:
      return state;
  }
}
