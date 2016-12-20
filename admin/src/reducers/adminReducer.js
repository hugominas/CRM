import {UPDATE_DATA, UPDATE_DATE, DELETE_DATA, UPDATE_SELECTOR, UPDATE_DATA_SINGLE, UPDATE_FORM, UPDATE_PAGER, UPDATE_SELECTED} from '../actions/actionTypes';
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
      let total = newState.pager.totalItems;
      let totalPages = newState.pager.totalPages;


      if(action.result.data.data[action.result.data.data.length-1].hasOwnProperty('count')){

        total = action.result.data.data[action.result.data.data.length-1].count;
        totalPages = Math.ceil(total/newState.pager.items);
        action.result.data.data.pop();

      }


      //MAKE THE CHANGES
      newState.data[action.what] = action.result.data.data;
      newState.pager= {... newState.pager, totalItems:total, totalPages:totalPages }

      return newState;

      break;
      case UPDATE_DATA_SINGLE:
      //MAKE THE CHANGES
      return objectAssign({}, state, {[action.what]: action.result.data.data[0]});

      break;
      case UPDATE_SELECTED:
      //MAKE THE CHANGES
        return {... state, expanded: action.id}

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
      //add ploral to affect the correct element
      action.what = (action.what=='lead')?'leads':action.what
      //return correct element
      return {
         ...state,
         data : {
             ...state.data,
             [action.what] : state.data[action.what].filter((ele)=>{
               console.log(ele._id,action.id);
               return (ele._id!=action.id)})
         }
       }
      break;

    default:
      return state;
  }
}
