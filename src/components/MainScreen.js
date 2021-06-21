import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {isOnline} from '../utils';
import {showMessage} from 'react-native-flash-message';
import {
  fetchMeal,
  addMeal,
  deleteMeal,
  editMeal,
  setCalories,
} from '../../actions/mealsActions';
import moment from 'moment';
import {AddMeal, EditMeal, Settings} from '.';
import Modal from 'react-native-modal';
import {remove, pencil, settings} from '../images';
import AsyncStorage from '@react-native-community/async-storage';

class MainScreen extends Component {
  state = {
    date: moment(new Date()).format('DD-MM-YYYY'),
    items: [],
    addedMeals: [],
    selectedMeal: {},
    mealTimes: [
      {id: 1, name: 'Breakfast'},
      {id: 4, name: 'Lunch'},
      {id: 6, name: 'Supper'},
    ],
    selectedMealTime: {},
    addedMeals: [],
    mealsToAdd: {},
    showModal: false,
    ['showModalEdit']: false,
    consumedCalories: 0,
    remainingCalories: 1000,
    maximumCalories: 1000,
    showSettings: false,
  };

  // set date to selected date
  onDateChange = date => {
    this.setState({date: date});
    this.props.addMeal(false, false);
  };

  // navigate to add meal screen
  navigateToAddMeal = () => {
    this.props.navigation.navigate('AddMealScreen');
  };

  // open add meal modal
  openModal = () => {
    const {showModal} = this.state;
    this.setState({
      showModal: !showModal,
    });
  };

  // open settings modal
  openModalSettings = () => {
    const {showSettings} = this.state;
    this.setState({
      showSettings: !showSettings,
    });
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

  componentDidMount() {
    // check online status
    isOnline((err, state) => {
      if (err) {
        // console.log(err);
        showMessage({
          message: 'You are offline',
          description: 'Turn on your WI-FI or Data To Proceed',
          type: 'danger',
          icon: 'danger',
          duration: 5000,
        });
      } else {
        if (state) {
          // console.log(state);
        }
      }
    });
    this.props.fetchMeal('grilled');
    // fetch already saved meals
    AsyncStorage.getItem('allMealsSaved').then(value => {
      if (value === null || value === false) {
        AsyncStorage.setItem('allMealsSaved', JSON.stringify([]));
      } else {
        // let data = JSON.parse(value);
        this.setState({
          addedMeals: JSON.parse(value),
        });
      }
      this.props.addMeal(false, false);
    });
    // get maximum calories calories
    AsyncStorage.getItem('calories').then(value => {
      if (value === null || value === false) {
        AsyncStorage.setItem('calories', JSON.stringify(1000));
      } else {
        this.setState({
          maximumCalories: parseInt(JSON.parse(value)),
        });
      }
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.addedMeals !== state.addedMeals) {
      let caloriesSum = 0;
      props.addedMeals
        .filter(item => item.date === state.date)
        .map(meal => {
          caloriesSum += parseInt(meal.calories);
        });

      return {
        addedMeals: props.addedMeals,
        consumedCalories: caloriesSum,
        remainingCalories: state.maximumCalories - caloriesSum,
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

    if (props.calories !== state.maximumCalories.toString()) {
      return {
        maximumCalories: parseInt(props.calories),
      };
    }
    return null;
  }

  // on selecting an item (meal)
  onSelectedMeal = meal => {
    console.log(meal);
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

  // remove selected meal
  removeItems = () => {
    this.setState({
      date: moment(new Date()).format('DD-MM-YYYY'),
      selectedMeal: {},
      selectedMealTime: {},
    });
  };

  // update settings
  updateSettings = () => {
    const {maximumCalories} = this.state;
    this.props.setCalories(maximumCalories);
    this.props.addMeal(false, false);
    this.openModalSettings();
  };

  // handle input change
  handleCaloriesChange = maximumCalories => {
    this.setState({maximumCalories});
  };

  render() {
    const {
      addedMeals,
      date,
      items,
      selectedMealTime,
      selectedMeal,
      mealTimes,
      showModal,
      showModalEdit,
      consumedCalories,
      remainingCalories,
      showSettings,
      maximumCalories,
    } = this.state;

    // filter breakfast
    const displayFilteredMealBreakfast =
      addedMeals instanceof Array
        ? addedMeals
            .filter(
              meal =>
                meal.date === date && meal.selectedMealTime === 'Breakfast',
            )
            .map(ml => {
              return ml;
            })
        : null;

    // filter lunch
    const displayFilteredMealLunch =
      addedMeals instanceof Array
        ? addedMeals
            .filter(
              meal => meal.date === date && meal.selectedMealTime === 'Lunch',
            )
            .map(ml => {
              return ml;
            })
        : null;

    // filter Supper
    const displayFilteredMealSupper =
      addedMeals instanceof Array
        ? addedMeals
            .filter(
              meal => meal.date === date && meal.selectedMealTime === 'Supper',
            )
            .map(ml => {
              return ml;
            })
        : null;

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.appName}>Calories Tracker</Text>
          <View style={styles.seetingsCard}>
            <TouchableOpacity onPress={this.navigateToAddMeal}>
              <Text style={styles.appName}>Add Meals</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.openModalSettings}>
              <Image source={settings} style={styles.imageSettings} />
              <Modal isVisible={showSettings}>
                <View style={{flex: 1}}>
                  <Settings
                    openModal={this.openModalSettings}
                    maximumCalories={maximumCalories}
                    updateSettings={this.updateSettings}
                    handleCaloriesChange={this.handleCaloriesChange}
                  />
                </View>
              </Modal>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.dateAddItemCard}>
            <DatePicker
              style={styles.datePicker}
              date={date}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
              }}
              onDateChange={date => {
                this.onDateChange(date);
              }}
            />
            <TouchableOpacity style={styles.button} onPress={this.openModal}>
              <Text style={styles.btnLabel}>Add Meal for The Day</Text>
              <View>
                <Modal isVisible={showModal}>
                  <View style={{flex: 1}}>
                    <AddMeal
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
                      showDate={false}
                      removeItems={this.removeItems}
                    />
                  </View>
                </Modal>
              </View>
            </TouchableOpacity>
          </View>

          {/* calories for the day */}
          <View style={styles.caloriesCard}>
            <View>
              <Text style={styles.caloriesText}>
                Consumed Calories: {consumedCalories}
              </Text>
            </View>
            <View>
              <Text>|</Text>
            </View>
            <View>
              <Text style={styles.caloriesText}>
                Remaining Calories: {remainingCalories}
              </Text>
            </View>
          </View>
          {/* Breakfast */}
          <View>
            {displayFilteredMealBreakfast !== 0 && (
              <Text style={styles.mealTimeHeader}>Breakfast</Text>
            )}
          </View>
          <FlatList
            horizontal
            data={displayFilteredMealBreakfast}
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
                          marginLeft: 6,
                        }}>
                        <Text style={styles.textHeader}>Calories:</Text>
                        <Text style={styles.text}>{item.calories}</Text>
                        <Text style={styles.textHeader}>Servings:</Text>
                        <Text style={styles.text}>{item.serving_qty}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginLeft: 6,
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
          {/* Lunch */}
          <View>
            {displayFilteredMealLunch.length !== 0 && (
              <Text style={styles.mealTimeHeader}>Lunch</Text>
            )}
          </View>
          <FlatList
            horizontal
            data={displayFilteredMealLunch}
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
                          marginLeft: 6,
                        }}>
                        <Text style={styles.textHeader}>Calories:</Text>
                        <Text style={styles.text}>{item.calories}</Text>
                        <Text style={styles.textHeader}>Servings:</Text>
                        <Text style={styles.text}>{item.serving_qty}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginLeft: 6,
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
          {/* supper */}
          <View>
            {displayFilteredMealSupper.length !== 0 && (
              <Text style={styles.mealTimeHeader}>Supper</Text>
            )}
          </View>
          <FlatList
            horizontal
            data={displayFilteredMealSupper}
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
                          marginLeft: 6,
                        }}>
                        <Text style={styles.textHeader}>Calories:</Text>
                        <Text style={styles.text}>{item.calories}</Text>
                        <Text style={styles.textHeader}>Servings:</Text>
                        <Text style={styles.text}>{item.serving_qty}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginLeft: 6,
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
  caloriesCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 14,
    // marginHorizontal: 10,
    marginVertical: 12,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 3,
    // background color must be set
    backgroundColor: '#ffffff',
    zIndex: 999,
  },
  datePicker: {
    width: 175,
    fontSize: hp('1.8%'),
  },
  dateAddItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    // fontFamily: ''
  },
  button: {
    backgroundColor: '#F4B334',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 4,
  },
  btnLabel: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  caloriesText: {
    fontSize: hp('1.7%'),
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
  mealTimeHeader: {
    fontSize: hp('1.9%'),
    fontWeight: 'bold',
    marginRight: 3,
    opacity: 0.6,
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
    backgroundColor: '#ffffff',
    zIndex: 999,
    flexDirection: 'column',
    marginRight: 5,
    height: hp('20%'),
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
  seetingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
  imageSettings: {
    width: 25,
    height: 25,
    marginLeft: 25,
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
  addedMeals: state.meal.addedMeals,
  allMeals: state.meal.mealDetails,
  calories: state.meal.calories,
});
export default connect(mapStateToProps, {
  fetchMeal,
  addMeal,
  deleteMeal,
  editMeal,
  setCalories,
})(MainScreen);
