import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import DatePicker from 'react-native-datepicker';
import {del} from '../images';

const AddMeal = ({
  date,
  onSelectedMeal,
  items,
  queryMeals,
  onDateChange,
  onSelectedMealTime,
  mealTimes,
  openModal,
  selectedMeal,
  selectedMealTime,
  showDate,
  addMealToList,
  removeItems,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Add Meal</Text>
      </View>
      {/* select meal name */}
      <SearchableDropdown
        onItemSelect={item => onSelectedMeal(item)}
        containerStyle={{padding: 5}}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: '#ddd',
          borderColor: '#bbb',
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemTextStyle={{color: '#222'}}
        itemsContainerStyle={{maxHeight: 140}}
        items={items}
        defaultIndex={0}
        resetValue={false}
        textInputProps={{
          placeholder: 'Add meal',
          underlineColorAndroid: 'transparent',
          style: {
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
          },
          onTextChange: text => queryMeals(text),
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />

      {/* select meal time */}
      <SearchableDropdown
        onItemSelect={item => onSelectedMealTime(item)}
        containerStyle={{padding: 5}}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: '#ddd',
          borderColor: '#bbb',
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemTextStyle={{color: '#222'}}
        itemsContainerStyle={{maxHeight: 140}}
        items={mealTimes}
        defaultIndex={0}
        resetValue={false}
        textInputProps={{
          placeholder: 'Select meal time',
          underlineColorAndroid: 'transparent',
          style: {
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
          },
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      {/* select date for the meal */}
      {showDate && (
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
            onDateChange(date);
          }}
        />
      )}

      {/* Food to be added */}
      <View style={styles.selectedDetails}>
        {Object.keys(selectedMeal).length !== 0 && (
          <Text style={styles.detailText}>{`Food: ${selectedMeal.name}`}</Text>
        )}
        {Object.keys(selectedMealTime).length !== 0 && (
          <View>
            <Text style={styles.detailText}>{`Date: ${date}`}</Text>
            <Text
              style={
                styles.detailText
              }>{`Meal Time: ${selectedMealTime.name}`}</Text>
            <TouchableOpacity style={styles.imageCard} onPress={removeItems}>
              <Image source={del} style={styles.image} />
              <Text>Remove Items</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.buttonsCard}>
        <TouchableOpacity onPress={openModal} style={styles.closeButton}>
          <Text style={styles.btnLabel}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addMealToList} style={styles.addButton}>
          <Text style={styles.btnLabel}>Add Meal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    marginRight: 9
  },
  imageCard: {
    marginVertical: 9,
    flexDirection: 'row'
  }
});

export default AddMeal;
