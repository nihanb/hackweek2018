import React, { Component } from 'react';
import queryString from 'query-string';

import Header from '../components/Header';
import Footer from '../components/Footer';

import * as api from '../api/api';

import PlaylistEditInterface from '../components/PlaylistEditInterface/PlaylistEditInterface';
import PlaylistListInterface from '../components/PlaylistListInterface/PlaylistListInterface';
import Player from '../components/Player/Player';
import NowPlaying from '../components/NowPlaying/NowPlaying';

import './App.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false,
      playerState: {
        track_window: {
          current_track: {
            name: '',
            artists: [],
            album: {
              images: [],
            },
          },
        },
      },
    };

    this.appToken = '364795ab3513446e91f04944fda2b35f';
    this.redirectURI = encodeURIComponent(
      `${window.location.protocol }//${ window.location.host }/callback`
    );
    this.scopes = encodeURIComponent(
      'user-read-private playlist-read-private playlist-read-collaborative' +
      ' playlist-modify-private playlist-modify-public streaming user-read-birthdate user-modify-playback-state'
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

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handlePlayerDeviceId = this.handlePlayerDeviceId.bind(this);
    this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
  }

  componentDidMount() {
    const hasError =
      queryString.parse(window.location.search).error === 'access_denied';
    if (hasError) {
      // eslint-disable-next-line no-alert
      window.alert('You must sign in to manage your playlists.');
      return;
    }

    this.getUserAndPlaylist();
  }

  setCurrentToken(tokenObject) {
    sessionStorage.setItem('tokenobject', JSON.stringify(tokenObject));
  }

  getCurrentToken() {
    return JSON.parse(sessionStorage.getItem('tokenobject'));
  }

  getUserAndPlaylist() {
    const token = this.getCurrentToken();
    if (token) {
      api.getCurrentUserProfile(token.value).then((payload) => {
        const user = payload.data;
        this.setState({user});
      });

      var playlists = JSON.parse(localStorage.getItem('playlists'));
      if (playlists) {
        this.setState({playlists});
      } else {
        api.getPlaylists(token.value).then((payload) => {
          const playlists = payload.data.items;
          this.setState({playlists});
          playlists.map((playlist) => {
            api.getPlaylistTracks(token.value, playlist.id).then((payload)=>{
              const tracks = payload.data;
              let current = this.state.playlists.filter(pl => pl.id === playlist.id)[0];
              current.tracks = tracks.items;
              this.setState({...playlists, current});
              localStorage.setItem('playlists', JSON.stringify(this.state.playlists));
            })
          })
        });
      }
    }
  }

  handlePlayerDeviceId(deviceId) {
    this.setState({deviceId: deviceId});
  }

  handlePlayClick(trackUri) {
    api.play(this.state.deviceId, this.getCurrentToken().value, trackUri);
  }

  removeCurrentToken() {
    sessionStorage.removeItem('tokenobject');
  }

  handleEditClick(trackIndex, playlistId, canEdit) {
    this.setState({
      showModal: true,
      trackIndex: trackIndex,
      playlistId: playlistId,
      canEdit: canEdit,
    });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleSaveClick(trackIndex, playlistId, data) {
    let current = this.state.playlists.filter(pl => pl.id === playlistId)[0];
    current.tracks[trackIndex].comment = data;
    this.setState({...this.state.playlists, current});
    localStorage.setItem('playlists', JSON.stringify(this.state.playlists));
  }

  handleLogoutClick() {
    this.removeCurrentToken();
    this.setState({ userLoggedIn: false });
  }

  handlePlayerStateChange(data) {
    this.setState({playerState: data});
  }

  render() {
    const { trackIndex, userLoggedIn, showModal, userId, playlistId, canEdit, user, playlists } = this.state;
    return (
      <div className="App">
        <Header />
        <NowPlaying playerState={this.state.playerState}/>
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
              <button
                className="btn btn-primary btn-xs pull-right btnlogout"
                onClick={() => {
                  this.handleLogoutClick();
                }}
              >
                Logout
              </button>
              <Player
                onDeviceIdReady={this.handlePlayerDeviceId}
                onPlayerStateChange={this.handlePlayerStateChange}
                token={this.getCurrentToken().value}
              />
              {showModal && (
                <PlaylistEditInterface
                  showModal={showModal}
                  handleCloseModal={this.handleCloseModal}
                  handleSaveClick={this.handleSaveClick}
                  userId={userId}
                  index={trackIndex}
                  playlist={playlists.filter(pl => pl.id === playlistId)[0]}
                  token={this.getCurrentToken().value}
                  canEdit={canEdit}
                />
              )}
              {(playlists && user) ?
                <PlaylistListInterface
                  user={user}
                  playlists={playlists}
                  handleEditClick={this.handleEditClick}
                  handlePlayClick={this.handlePlayClick}
                />
                :
                <div className="loadingplaylist">Loading playlists...</div>
              }
            </div>
          )}
        </div>

        <Footer />
      </div>
    );
  }
}
export default App;
