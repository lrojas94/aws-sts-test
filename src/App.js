import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import FacebookLogin from 'react-facebook-login'

class App extends Component {

  loggedIntoFb = (response) => {
    console.log(response);
  }

  render() {
    console.log(process.env);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">AWS STS React Example</h1>
        </header>
        <p className="App-intro">
          <FacebookLogin
            appId={process.env.REACT_APP_FB_APP_ID}
            autoLoad={true}
            callback={this.loggedIntoFb} 
          />      
        </p>
      </div>
    );
  }
}

export default App;
