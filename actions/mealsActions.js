import axios from 'axios';
import {
  ADD_MEAL,
  FETCH_MEAL_DETAILS,
  DELETE_MEAL,
  EDIT_MEAL,
  SET_CALORIES,
} from './types';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';

const headers = {
  'x-app-id': 'cfa01ab6',
  'x-app-key': '040ba414e32e3bbc58c5ff6f650d2671',
};

// search for a meal
export const fetchMeal = query => dispatch => {
  let base_url = `https://trackapi.nutritionix.com/`;

  let url = `v2/search/instant?query=${query}&detailed=true`;

  axios({
    method: 'get',
    baseURL: base_url,
    url,
    headers,
  })
    .then(response => {
      console.log(response);
      dispatch({
        type: FETCH_MEAL_DETAILS,
        payload: response.data,
      });
    })
    .catch(error => console.log(error.response));
};

// add a meal to your list
export const addMeal = mealDetails => dispatch => {
  console.log(mealDetails);
  // AsyncStorage.removeItem('allMealsSaved');
  AsyncStorage.getItem('allMealsSaved').then(value => {
    console.log(value);

    if (value === null || value === false) {
      console.log(value);
      AsyncStorage.setItem('allMealsSaved', JSON.stringify([mealDetails]));
    } else {
      let data = JSON.parse(value);
      if (!mealDetails) {
        dispatch({
          type: ADD_MEAL,
          payload: [...data],
        });
      } else {
        AsyncStorage.setItem(
          'allMealsSaved',
          JSON.stringify([...data, mealDetails]),
        );

        dispatch({
          type: ADD_MEAL,
          payload: [...data, mealDetails],
        });
        // show a success message when meal is added
        showMessage({
          message: 'Success',
          description: 'Meal added!!',
          type: 'success',
          icon: 'success',
          duration: 5000,
        });
      }
    }
  });
};

// delete a meal
export const deleteMeal = id => dispatch => {
  AsyncStorage.getItem('allMealsSaved').then(value => {
    if (value === null || value === false) {
      return null;
    } else {
      let data = JSON.parse(value);
      // filter array by the id slected
      const filteredArray = data.filter(uuu => uuu.id !== id).map(item => item);

      console.log(filteredArray);

      // replace local storage with the new array
      AsyncStorage.setItem('allMealsSaved', JSON.stringify(filteredArray));

      dispatch({
        type: DELETE_MEAL,
        payload: filteredArray,
      });
      // show a success message when meal is added
      showMessage({
        message: 'Success',
        description: 'Meal deleted!!',
        type: 'success',
        icon: 'success',
        duration: 5000,
      });
    }
  });
};

// edit a meal
export const editMeal = (id, mealDetails) => dispatch => {
  AsyncStorage.getItem('allMealsSaved').then(value => {
    if (value === null || value === false) {
      return null;
    } else {
      let data = JSON.parse(value);
      // find the index of the object by the id slected
      let foundIndex = data.findIndex(x => x.id == id);
      data[foundIndex] = mealDetails;
      console.log(data);

      // replace local storage with the new array
      AsyncStorage.setItem('allMealsSaved', JSON.stringify(data));

      dispatch({
        type: EDIT_MEAL,
        payload: data,
      });
      // show a success message when meal is added
      showMessage({
        message: 'Success',
        description: 'Meal edited!!',
        type: 'success',
        icon: 'success',
        duration: 5000,
      });
    }
  });
};

// set maximum daily calories
export const setCalories = calories => dispatch => {
  // replace local storage with the new array
  AsyncStorage.setItem('calories', JSON.stringify(calories));

  dispatch({
    type: SET_CALORIES,
    payload: calories,
  });
  // show a success message when calories change
  showMessage({
    message: 'Success',
    description: 'Settings Updated!!',
    type: 'success',
    icon: 'success',
    duration: 5000,
  });
};
