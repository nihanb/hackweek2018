import PropTypes from 'prop-types';
import React, { Component } from 'react';

class NowPlaying extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Now playing</h1>
        <img src={this.props.playerState.track_window.current_track.album.images.length > 0 && this.props.playerState.track_window.current_track.album.images[0].url} />
        <p>Track name: {this.props.playerState.track_window.current_track.name}</p>
        <div>
          Artist: {this.props.playerState.track_window.current_track.artists.map( artist => (
            <span>{artist.name}</span>
          ))}
        </div>
      </div>
    );
  }
}

NowPlaying.propTypes = {
  playerState: PropTypes.object,
};

export default NowPlaying;
