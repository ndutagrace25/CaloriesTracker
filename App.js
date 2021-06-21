import React, {Component, Fragment} from 'react';
import Router from './Routes';
import FlashMessage from 'react-native-flash-message';

class App extends Component {
  state = {};

  render() {
    return (
      <Fragment style={{ flex: 1 }}>
        <Router />
        <FlashMessage position="top" style={{zIndex: 5000}}/>
      </Fragment>
    );
  }
}

export default App;
