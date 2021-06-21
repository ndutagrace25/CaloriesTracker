import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

class Settings extends Component {
  state = {};

  render() {
    const {maximumCalories} = this.props;
    return (
      <View style={styles.container}>
        <View>
          <Text>Enter Daily Calories Target</Text>
          <TextInput
            style={styles.input}
            textAlignVertical={'center'}
            // secureTextEntry={true}
            keyboardType="number-pad"
            onChangeText={this.props.handleCaloriesChange}
            // value={maximumCalories}
          />
        </View>
        <View style={styles.buttonsCard}>
          <TouchableOpacity
            onPress={this.props.openModal}
            style={styles.closeButton}>
            <Text style={styles.btnLabel}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.updateSettings}
            style={styles.addButton}>
            <Text style={styles.btnLabel}>Update Settings</Text>
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
  input: {
    width: responsiveWidth(80),
    height: responsiveHeight(6.4),
    marginTop: responsiveHeight(0.4),
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#fff',
    borderColor: '#F4B334',
    borderWidth: 1,
    borderRadius: 4,
    color: '#0D47A1',
    paddingLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(2.4),
    padding: 0,
    margin: 0,
  },
});

export default Settings;
