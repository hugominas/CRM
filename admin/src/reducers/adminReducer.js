import {UPDATE_DATA, UPDATE_DATE, DELETE_LEAD, UPDATE_SELECTOR} from '../actions/actionTypes';
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
      // For this example, just simulating a save by changing date modified.
      // In a real app using Redux, you might use redux-thunk and handle the async call in fuelSavingsActions.js
      let newState = objectAssign({}, state);
      //MAKE THE CHANGES
      newState.data[action.what] = action.result.data.data;
      return newState;

      break;
    case UPDATE_SELECTOR:

      return objectAssign({}, state, {[action.what]: action.id});
      break;
    case UPDATE_DATE:
      newState = objectAssign({}, state);
      newState[action.fieldName] = action.value;
      newState.necessaryDataIsProvidedToCalculateSavings = calculator().necessaryDataIsProvidedToCalculateSavings(newState);
      newState.dateModified = action.dateModified;

      if (newState.necessaryDataIsProvidedToCalculateSavings) {
        newState.savings = calculator().calculateSavings(newState);
      }

      return newState;
      break;
      case DELETE_LEAD:

      break;

    default:
      return state;
  }
}
