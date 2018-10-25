import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PlaylistListInterface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: this.props.playlists,
      user: this.props.user,
    };
  }

   render() {
    const { playlists, user } = this.state;
    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Your Mixtapes 🎵</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {playlists && playlists.map(playlist =>
              (<tr key={playlist.id}>
                <h1>{playlist.name}</h1>
                {playlist.tracks.length > 0 && playlist.tracks.map((track, i) => (
                  <div>
                    <tr>
                      <td><h3>{track.track.name}</h3></td>
                      <td><button className="commentBtn"
                        onClick={() => {
                          this.props.handleEditClick(i, playlist.id, true);
                        }}></button></td>
                        <td><button className="playBtn"
                        onClick={() => {
                          this.props.handlePlayClick(track.track.uri);
                        }}></button></td>
                    </tr>
                    <tr>{track.comment}</tr>
                  </div>
                ))}
              </tr>))}
          </tbody>
        </table>
      </div>
    );
  }
}

PlaylistListInterface.propTypes = {
  playlists: PropTypes.array,
  user: PropTypes.object,
  handleEditClick: PropTypes.func,
  handlePlayClick: PropTypes.func,
};

export default PlaylistListInterface;
