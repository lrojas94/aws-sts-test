import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import FacebookLogin from 'react-facebook-login'
import AWS from 'aws-sdk';

class App extends Component {
  state = {
    s3: null,
    buckets: [],
  };

  assumeRoleCallback = (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(data);

    const { Credentials: { AccessKeyId, SecretAccessKey, SessionToken }} = data;
    const opts = {
      accessKeyId: AccessKeyId,
      secretAccessKey: SecretAccessKey,
      sessionToken: SessionToken,
    };

    console.log(opts);

    const s3 = new AWS.S3(opts);
    console.log(s3);
    s3.listBuckets({}, this.listBucketsCallback);
    this.setState({ s3 });
  }

  loggedIntoFb = (response) => {
    const { accessToken, id: fbId } = response;
    const sts = new AWS.STS();
    const params ={
      DurationSeconds: 3600,
      ProviderId: "graph.facebook.com",
      RoleArn: process.env.REACT_APP_AWS_ROLE_ARN,
      RoleSessionName: fbId,
      WebIdentityToken: accessToken,
    };

    sts.assumeRoleWithWebIdentity(params, this.assumeRoleCallback);
  }
  
  listBucketsCallback = (err, data) => {
    if (err) {
      console.log('listBucketsCallback :: There was an error listing buckets.');
      console.log(err);
      return;
    }

    const { Buckets: buckets } = data;
    console.log(buckets);
    this.setState({ buckets });
  }

  listBuckets = (ev) => {
    if (ev) {
      ev.preventDefault(); // In case we get click event.
    }

    const { s3 } = this.state;
    s3.listBuckets({}, this.listBucketsCallback);
  }

  renderFb() {
    return (
      <p className="App-intro">
        <FacebookLogin
          appId={process.env.REACT_APP_FB_APP_ID}
          autoLoad={true}
          callback={this.loggedIntoFb}
        />
      </p>
    );
  }

  renderBuckets() {
    const { buckets } = this.state;
    return (
      <div className="App-intro">
        <a href="#" onClick={this.listBuckets}> Reload Buckets </a>
        { buckets.map(bucket => console.log(bucket)) }
      </div>
    )
  }

  render() {
    const {
      s3,
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">AWS STS React Example</h1>
        </header>
        { !s3 && this.renderFb() }
        { !!s3 && this.renderBuckets() }
      </div>
    );
  }
}

export default App;
