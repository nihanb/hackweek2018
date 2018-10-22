import React, {Component} from 'react';


class PlaylistListInterface extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playlists: this.props.playlists,
      user: this.props.user,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      playlists: nextProps.playlists,
      user: nextProps.user,
    });
  }


  render() {
    const {playlists, user} = this.state;
    return (
      <div>
        <h2>Welcome {user.display_name}</h2>
        <table className="table table-striped">
          <thead>
          <tr>
            <th>Playlist name</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {playlists && playlists.map(playlist =>
            (<tr key={playlist.id}>
              <td>{playlist.name}</td>
              <td>{user.id === playlist.owner.id ?
                <button className="btn btn-primary btn-xs pull-right"
                        onClick={() => {
                          this.props.handleEditClick(playlist.owner.id, playlist.id, true);
                        }}>Edit
                </button>
                :
                <button className="btn btn-default btn-xs pull-right"
                        onClick={() => {
                          this.props.handleEditClick(playlist.owner.id, playlist.id, false);
                        }}>Show
                </button>
              }
              </td>
            </tr>))}
          </tbody>
        </table>
      </div>
    );
  }

}

export default PlaylistListInterface;
