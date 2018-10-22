import React, { Component } from 'react';
import queryString from 'query-string';

import Header from '../components/Header';
import Footer from '../components/Footer';

import './App.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false,
    };

    this.appToken = '08257d43eac4490c9124235c27fd1793';
    this.redirectURI = encodeURIComponent(
      `${window.location.protocol }//${ window.location.host }/callback`
    );
    this.scopes = encodeURIComponent(
      'user-read-private playlist-read-private playlist-read-collaborative' +
      ' playlist-modify-private playlist-modify-public'
    );
    this.loginLink = `https://accounts.spotify.com/authorize?client_id=${
      this.appToken}&redirect_uri=${this.redirectURI}&scope=${this.scopes}&response_type=token`;

    let tokenObject = {
      value: queryString.parse(window.location.hash).access_token,
      genDate: Date.now(),
    };
    // Get the login from the cache if necessary
    if (tokenObject.value) {
      this.setCurrentToken(tokenObject);
    } else {
      tokenObject = this.getCurrentToken();
    }

    if (tokenObject && tokenObject.value) {
      if (tokenObject.genDate <= Date.now() - 3600000) {
        this.removeCurrentToken();
      } else {
        this.state.userLoggedIn = true;
        window.location.hash = '';
      }
    } else {
      this.removeCurrentToken();
    }
  }

  componentDidMount() {
    const hasError =
      queryString.parse(window.location.search).error === 'access_denied';
    if (hasError) {
      // eslint-disable-next-line no-alert
      window.alert('You must sign in to manage your playlists.');
      return;
    }
  }

  setCurrentToken(tokenObject) {
    sessionStorage.setItem('tokenobject', JSON.stringify(tokenObject));
  }

  getCurrentToken() {
    return JSON.parse(sessionStorage.getItem('tokenobject'));
  }

  removeCurrentToken() {
    sessionStorage.removeItem('tokenobject');
  }

  render() {
    const { userLoggedIn } = this.state;
    return (
      <div className="App">
        <Header />

        <div className="container" role="main">
          {!userLoggedIn ? (
            <div className="loginbutton">
              <h2>Welcome anonymous user.</h2>
              <p>
                To start modifying your playlists, please login using the button
                below:
              </p>
              <a className="btn btn-primary btn-xs" href={this.loginLink}>
                Login with your Spotify Account
              </a>
            </div>
          ) : (
            <div className="userloggedin">
              I am logged in!
            </div>
          )}
        </div>

        <Footer />
      </div>
    );
  }
}
export default App;