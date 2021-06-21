import {combineReducers} from 'redux';
import errorReducer from './errorReducer';
import mealReducer from './mealReducer';

export default combineReducers({
  errors: errorReducer,
  meal: mealReducer,
});
