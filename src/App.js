import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import FacebookLogin from 'react-facebook-login'
import AWS from 'aws-sdk';

class App extends Component {
  state = {
    s3: null,
    objects: [],
  };

  assumeRoleCallback = (err, data) => {
    if (err) {
      console.log('assumeRoleCallback :: There was an error assuming role...');
      console.log(err);
      return;
    }

    const { Credentials: { AccessKeyId, SecretAccessKey, SessionToken }} = data;
    const opts = {
      accessKeyId: AccessKeyId,
      secretAccessKey: SecretAccessKey,
      sessionToken: SessionToken,
      region: process.env.REACT_APP_AWS_REGION,
    };

    const s3 = new AWS.S3(opts);
    this.setState({ s3 }, () => this.listObjects());
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

  listObjectsCallback = (err, data) => {
    if (err) {
      console.log('listObjectsCallback :: There was an error listing objects.');
      console.log(err);
      return;
    }

    this.setState({ objects: data.Contents });
  }

  listObjects = (ev) => {
    if (ev) {
      ev.preventDefault(); // In case we get click event.
    }

    const { s3 } = this.state;

    s3.listObjectsV2({
      Bucket: process.env.REACT_APP_BUCKET,
    }, this.listObjectsCallback);
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
    const { objects, bucketName } = this.state;
    return (
      <div className="App-intro">
        <h3> You have been connected to a bucket! </h3>
        <a href="#" onClick={this.listObjects}> Reload Bucket Content </a>
        <h4> Contents are listed bellow </h4>
        {objects.map(bucketItem => (
          <p key={bucketItem.Key}>{bucketItem.Key}</p>
        ))}
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
