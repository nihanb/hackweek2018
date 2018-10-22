import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Player extends Component {
  constructor(props) {
    super(props);
    window.onSpotifyWebPlaybackSDKReady = function() {
      const player = new window.Spotify.Player({
        name: 'spottyplayer',
        getOAuthToken: cb => { cb(props.token);},
      });
      player.on('initialization_error', e => console.error(e));
      player.on('authentication_error', e => console.error(e));
      player.on('account_error', e => console.error(e));
      player.on('playback_error', e => console.error(e));

      player.on('ready', function(data) {
        console.log('ready event:', data);
        props.onDeviceIdReady(data.device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.on('player_state_changed', function(data) {
        console.log('Player state changed');
        console.log(JSON.stringify(data));
      });

      player.connect();
    };
  }

  render() {
    return (
      <div/>
    );
  }
}


Player.propTypes = {
  onDeviceIdReady: PropTypes.func,
  token: PropTypes.string,
};


export default Player;
