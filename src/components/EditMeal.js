import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import DatePicker from 'react-native-datepicker';
// import {del} from '../images';
import moment from 'moment';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

class EditMeal extends Component {
  state = {
    id: '',
    date: moment(new Date()).format('DD-MM-YYYY'),
    name: '',
    photo: '',
    selectedMealTime: '',
    calories: 0,
    serving_qty: 0,
    createdAt: new Date(),
  };

  componentDidMount() {
    const {
      date,
      serving_qty,
      calories,
      selectedMeal,
      photo,
      selectedMealTime,
      createdAt,
      selectedItem,
    } = this.props;
    this.setState({
      id: selectedItem,
      date,
      name: selectedMeal,
      photo,
      selectedMealTime,
      calories,
      serving_qty,
      createdAt,
    });
  }

  // edit Meal
  editMeal = () => {
    const {
      id,
      date,
      name,
      photo,
      selectedMealTime,
      calories,
      serving_qty,
      createdAt,
    } = this.state;

    let data = {
      id,
      date,
      name,
      photo,
      selectedMealTime,
      calories,
      serving_qty,
      createdAt,
    };

    this.props.editMeal(id, data);
  };

  // set date to selected date
  onDateChange = date => {
    this.setState({date: date});
  };

  // on servings cahnge
  handleServingsChange = serving_qty => {
    this.setState({serving_qty});
  };

  // on calories cahnge
  handleCaloriesChange = calories => {
    this.setState({calories});
  };

  render() {
    const {
      items,
      queryMeals,
      mealTimes,
      openModal,
      selectedItem,
      onSelectedMeal,
    } = this.props;
    const {date, name, selectedMealTime, calories, serving_qty} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Edit Meal</Text>
        </View>

        {/* select date for the meal */}
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

        {/* servings */}
        <TextInput
          style={styles.input}
          textAlignVertical={'center'}
          // secureTextEntry={true}
          keyboardType="number-pad"
          onChangeText={this.handleServingsChange}
          placeholder="Servings"
          // value={maximumCalories}
        />

        {/* calories */}
        <TextInput
          style={styles.input}
          textAlignVertical={'center'}
          // secureTextEntry={true}
          keyboardType="number-pad"
          placeholder="Calories"
          onChangeText={this.handleCaloriesChange}
          // value={maximumCalories}
        />

        {/* Food to be added */}
        <View style={styles.selectedDetails}>
          <Text style={styles.detailText}>{`Food: ${name}`}</Text>
          <View>
            <Text
              style={
                styles.detailText
              }>{`Meal Time: ${selectedMealTime}`}</Text>
            <Text style={styles.detailText}>{`Date: ${date}`}</Text>

            <Text style={styles.detailText}>{`Servings: ${serving_qty}`}</Text>
            <Text style={styles.detailText}>{`Calories: ${calories}`}</Text>
          </View>
        </View>
        <View style={styles.buttonsCard}>
          <TouchableOpacity
            onPress={() => openModal(selectedItem)}
            style={styles.closeButton}>
            <Text style={styles.btnLabel}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.editMeal} style={styles.addButton}>
            <Text style={styles.btnLabel}>Edit Meal</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E4E4E4',
    paddingHorizontal: 20,
    borderRadius: 3,
    paddingVertical: 25,
  },
  titleText: {
    fontWeight: 'bold',
    opacity: 0.8,
  },
  detailText: {
    fontWeight: 'bold',
    opacity: 0.6,
    marginVertical: 3,
  },
  title: {
    justifyContent: 'center',
    paddingVertical: 3,
    alignItems: 'center',
  },
  buttonsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopColor: '#bdbdbd',
    borderTopWidth: 1,
    paddingTop: 6,
  },
  closeButton: {
    backgroundColor: '#607d8b',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: '#2e7d32',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 4,
  },
  btnLabel: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  datePicker: {width: 280, marginTop: 10, borderRadius: 5},
  selectedDetails: {
    // alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 25,
    height: 25,
    marginRight: 9,
  },
  imageCard: {
    marginVertical: 9,
    flexDirection: 'row',
  },
  input: {
    width: responsiveWidth(80),
    height: responsiveHeight(6.4),
    marginTop: responsiveHeight(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    // backgroundColor: '#fff',
    borderColor: '#868685',
    borderWidth: 0.5,
    borderRadius: 4,
    color: '#0D47A1',
    paddingLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(1.7),
    padding: 0,
    margin: 0,
  },
});

export default EditMeal;
