import {
  FETCH_MEAL_DETAILS,
  ADD_MEAL,
  DELETE_MEAL,
  EDIT_MEAL,
  SET_CALORIES,
} from '../actions/types';

const initialState = {
  mealDetails: {},
  addedMeals: [],
  calories: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_MEAL_DETAILS:
      return {
        ...state,
        mealDetails: action.payload,
      };
    case ADD_MEAL:
      return {
        ...state,
        addedMeals: action.payload,
      };
    case DELETE_MEAL:
      return {
        ...state,
        addedMeals: action.payload,
      };
    case EDIT_MEAL:
      return {
        ...state,
        addedMeals: action.payload,
      };
    case SET_CALORIES:
      return {
        ...state,
        calories: action.payload,
      };
    default:
      return state;
  }
}
