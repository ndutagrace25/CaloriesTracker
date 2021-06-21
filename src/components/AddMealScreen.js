import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {remove, pencil} from '../images';

import {
  fetchMeal,
  addMeal,
  deleteMeal,
  editMeal,
} from '../../actions/mealsActions';
import Modal from 'react-native-modal';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import {AddMeal, EditMeal} from '.';

class AddMealScreen extends Component {
  state = {
    date: moment(new Date()).format('DD-MM-YYYY'),
    selectedMeal: {},
    items: [],
    mealTimes: [
      {id: 1, name: 'Breakfast'},
      {id: 4, name: 'Lunch'},
      {id: 6, name: 'Supper'},
    ],
    selectedMealTime: {},
    addedMeals: [],
    mealsToAdd: {},
    showModal: false,
    allSavedMeals: [],
  };

  // set date to selected date
  onDateChange = date => {
    this.setState({date: date});
  };

  // openmodal
  openModal = () => {
    const {showModal} = this.state;
    this.setState({
      showModal: !showModal,
    });
  };

  //   navigate to Main screen
  navigateToMainScreen = () => {
    this.props.navigation.navigate('MainScreen');
  };

  componentDidMount() {
    this.props.fetchMeal('grill');
    AsyncStorage.getItem('allMealsSaved').then(value => {
      if (value === null || value === false) {
        AsyncStorage.setItem('allMealsSaved', JSON.stringify([]));
      } else {
        // let data = JSON.parse(value);
        this.setState({
          addedMeals: JSON.parse(value),
        });
        console.log(JSON.parse(value));
      }
      this.props.addMeal(false, false);
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.addedMeals !== state.addedMeals) {
      return {
        addedMeals: props.addedMeals,
      };
    }
    if (props.allMeals !== state.items) {
      let meals =
        props.allMeals.branded instanceof Array
          ? props.allMeals.branded.map(food => {
              return {
                id: food.food_name,
                name: food.food_name,
                calories: food.nf_calories,
                serving_qty: food.serving_qty,
                photo: food.photo.thumb,
              };
            })
          : null;
      return {
        items: meals,
      };
    }

    return null;
  }

  // search for a meal
  queryMeals = text => {
    console.log(text);
    this.props.fetchMeal(text);
  };

  // add meal to the list
  addMealToList = () => {
    const {date, selectedMeal, selectedMealTime} = this.state;
    if (
      Object.keys(selectedMeal).length === 0 ||
      Object.keys(selectedMeal).length === 0
    ) {
      alert('Kindly select a meal and time of the meal');
    } else {
      // add meal to the list of already existing meals
      let data = {
        id: Math.random(100),
        date,
        name: selectedMeal.name,
        photo: selectedMeal.photo,
        selectedMealTime: selectedMealTime.name,
        calories: selectedMeal.calories,
        serving_qty: selectedMeal.serving_qty,
        createdAt: new Date(),
      };
      this.props.addMeal(data);
      this.setState({
        date: moment(new Date()).format('DD-MM-YYYY'),
        selectedMeal: {},
        selectedMealTime: {},
      });
      this.openModal();
    }
  };

  // on selecting an item (meal)
  onSelectedMeal = meal => {
    this.setState({
      selectedMeal: meal,
    });
  };

  // on selecting meal time (meal)
  onSelectedMealTime = time => {
    this.setState({
      selectedMealTime: time,
    });
  };

  // remove selected meal
  removeItems = () => {
    this.setState({
      date: moment(new Date()).format('DD-MM-YYYY'),
      selectedMeal: {},
      selectedMealTime: {},
    });
  };

  // delete a meal
  deleteMeal = (id, name) => {
    Alert.alert('Delete Meal', `Delete: ${name}?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'DELETE', onPress: () => this.props.deleteMeal(id)},
    ]);
  };

  // open Edit Modal
  openEditModal = modalToEdit => {
    this.setState({
      [`showModalEdit${modalToEdit}`]: true,
    });
  };

  // close edit Modal
  closeEditModal = modalToEdit => {
    this.setState({
      [`showModalEdit${modalToEdit}`]: false,
    });
  };

  // edit a meal
  editMeal = (id, data) => {
    Alert.alert('Edit Meal', `Edit: ${data.name}?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'EDIT',
        onPress: () => {
          this.props.editMeal(id, data);
          this.closeEditModal(id);
        },
      },
    ]);
  };

  render() {
    const {
      items,
      selectedMealTime,
      mealTimes,
      selectedMeal,
      date,
      allSavedMeals,
      showModal,
      addedMeals,
    } = this.state;

    return (
      <View style={styles.container}>
        {/* Header card */}
        <View style={styles.headerCard}>
          <Text style={styles.appName}>All Meals</Text>
          <TouchableOpacity onPress={this.navigateToMainScreen}>
            <Text style={styles.appName}>View Daily Meals</Text>
          </TouchableOpacity>
        </View>
        {/* content */}
        <View style={styles.content}>
          <TouchableOpacity onPress={this.openModal} style={styles.button}>
            <Text style={styles.btnLabel}>Add a Meal</Text>
            <View>
              <Modal isVisible={showModal}>
                <View style={{flex: 1}}>
                  <AddMeal
                    showDate={true}
                    date={date}
                    onSelectedMeal={this.onSelectedMeal}
                    items={items}
                    queryMeals={this.queryMeals}
                    onDateChange={this.onDateChange}
                    onSelectedMealTime={this.onSelectedMealTime}
                    mealTimes={mealTimes}
                    openModal={this.openModal}
                    selectedMealTime={selectedMealTime}
                    selectedMeal={selectedMeal}
                    addMealToList={this.addMealToList}
                    removeItems={this.removeItems}
                  />
                </View>
              </Modal>
            </View>
          </TouchableOpacity>
          {/* list all foods added */}
          <FlatList
            data={addedMeals}
            scrollEnabled={true}
            renderItem={({item}) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.foodName}>
                  {/* <Text style={styles.textHeader}>Meal</Text> */}
                  <Text style={styles.foodTitle}>{item.name}</Text>
                </View>
                <View style={styles.imageDetailsCard}>
                  <View>
                    <Image
                      source={{uri: item.photo}}
                      style={{height: 50, width: 80}}
                    />
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: 'column',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text style={styles.textHeader}>Calories:</Text>
                        <Text style={styles.text}>{item.calories}</Text>
                        <Text style={styles.textHeader}>Servings:</Text>
                        <Text style={styles.text}>{item.serving_qty}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text style={styles.textHeader}>Meal Time:</Text>
                        <Text style={styles.text}>{item.selectedMealTime}</Text>
                        <Text style={styles.textHeader}>Day:</Text>
                        <Text style={styles.text}>{item.date}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.imageCard}>
                  <TouchableOpacity onPress={() => this.openEditModal(item.id)}>
                    <Image source={pencil} style={styles.image} />
                    <Modal isVisible={this.state[`showModalEdit${item.id}`]}>
                      <View style={{flex: 1}}>
                        <EditMeal
                          selectedItem={item.id}
                          date={item.date}
                          onSelectedMeal={this.onSelectedMeal}
                          items={items}
                          queryMeals={this.queryMeals}
                          onDateChange={this.onDateChange}
                          onSelectedMealTime={this.onSelectedMealTime}
                          mealTimes={mealTimes}
                          openModal={this.closeEditModal}
                          selectedMealTime={item.selectedMealTime}
                          selectedMeal={item.name}
                          addMealToList={this.addMealToList}
                          removeItems={this.removeItems}
                          serving_qty={item.serving_qty}
                          calories={item.calories}
                          photo={item.photo}
                          createdAt={item.createdAt}
                          editMeal={this.editMeal}
                        />
                      </View>
                    </Modal>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.deleteMeal(item.id, item.name)}>
                    <Image source={remove} style={styles.imageRight} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    zIndex: 1,
  },
  headerCard: {
    padding: 5,
    backgroundColor: '#0971CE',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  appName: {
    fontWeight: 'bold',
    color: '#e0e0e0',
    fontSize: hp('1.8%'),
    fontFamily: 'Cochin',
  },
  content: {
    marginVertical: 15,
    marginHorizontal: 10,
    flex: 1,
  },
  button: {
    backgroundColor: '#F4B334',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 15,
  },
  btnLabel: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 5,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 3,
    // background color must be set
    backgroundColor: '#ffffff',
    zIndex: 999,
    flexDirection: 'column',
  },
  text: {
    fontSize: hp('1.7%'),
    marginRight: 8,
    fontStyle: 'italic',
  },
  textHeader: {
    fontSize: hp('1.7%'),
    fontWeight: 'bold',
    marginRight: 3,
    opacity: 0.6,
  },
  foodName: {
    borderBottomColor: '#90a4ae',
    borderBottomWidth: 0.1,
    marginBottom: 2,
  },
  imageDetailsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodTitle: {
    fontSize: hp('1.7%'),
    fontWeight: 'bold',
    opacity: 0.7,
  },
  image: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
  imageRight: {
    width: 15,
    height: 15,
    marginLeft: 15,
  },
  imageCard: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});

const mapStateToProps = state => ({
  allMeals: state.meal.mealDetails,
  addedMeals: state.meal.addedMeals,
});

export default connect(mapStateToProps, {
  fetchMeal,
  addMeal,
  deleteMeal,
  editMeal,
})(AddMealScreen);
