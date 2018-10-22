import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Modal from 'react-modal';

import * as api from '../../api/api';

import './PlaylistEditInterface.less';

class PlaylistEditInterface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentLoading: true,
      playlistImage: {images: []},
      canEdit: this.props.canEdit,
      propTypes: '',
    };
    if (!this.props.canEdit) {
      this.state.notification = 'This playlist is owned by another user. You cannot modify' +
                ' it.';
    }
  }

  componentWillMount() {
    Modal.setAppElement('#modalcontainer');
  }

  componentDidMount() {
    api.getPlaylistDetails(this.props.token, this.props.userId, this.props.playlistId).then((payload)=>{
      const playlist = payload.data;
      this.setState({
        contentLoading: false,
        playlist,
        playlistImage: playlist.images,
        playlistName: playlist.name,
        playlistDescription: playlist.description,
      });
    });
  }

  render() {
    const { contentLoading,
      playlist,
      playlistImage,
      playlistName,
      playlistDescription,
      notification,
      canEdit,
    } = this.state;

    return (
      <Modal
        className="modaldetails"
        isOpen={this.props.showModal}
        onRequestClose={this.props.handleCloseModal}
        shouldCloseOnOverlayClick
      >

        <div className="playlisteditorinterfacemain">
          {contentLoading ?
            <div className="contentloader">
                        Loading...
            </div> :
            <div className="contentloaded">
              <div className="editorheader">Edit Playlist Details</div>
              <form className="editorbody" id="editorbody">
                <div className="editname">
                  <div className="label">Name</div>
                  <div className="editField">
                    <input className="input name-input" name="name" value={playlistName} onChange={(event) => this.setState({playlistName: event.target.value})}/>
                  </div>
                </div>
                <div className="editimageanddescription">
                  <div className="editimagecontainer">
                    <div className="label imageinput">Image</div>
                    <div className="editimage">
                      {playlistImage.length ?
                        <img src={playlistImage[0].url} className="playlistimage" alt="PlaylistCover" /> :
                        <div className="uploadpicture glyphicon glyphicon-music" />
                      }

                    </div>
                  </div>
                  <div className="editdescription">
                    <div className="label">Description</div>
                    <textarea className="descriptiontextarea" name="description" value={playlistDescription ? playlistDescription : ''} onChange={(event) => this.setState({playlistDescription: event.target.value})} />
                  </div>
                </div>
                <div className="editnotification">
                  {notification ?
                    <div className="editnotificationontent">
                      <i className="glyphicon glyphicon-alert"/>
                      {notification}
                    </div> : null
                  }
                </div>
                <div className="editconfirm">
                  {canEdit ?
                    <div>
                      <button className="btn btn-default btn-xs btncancel" onClick={this.props.handleCloseModal}>Close</button>
                      <button className="btn btn-primary btn-xs btnsave" onClick={(event)=>{
                        event.preventDefault();
                        this.props.handleSaveClick(
                          playlist.owner.id,
                          playlist.id,
                          {
                            'name': playlistName,
                            'description': playlistDescription,
                          }).then(
                          this.setState({notification: 'Modification' +
                                                    ' saved with success!'})


                        );
                      }}>Save</button>
                    </div> :
                    <button className="btn btn-default btn-xs btncancel" onClick={this.props.handleCloseModal}>Close</button>
                  }
                </div>
              </form>
            </div>}
        </div>
      </Modal>
    );
  }
}

PlaylistEditInterface.propTypes = {
  playlist: PropTypes.object,
  canEdit: PropTypes.bool,
  token: PropTypes.string,
  userId: PropTypes.string,
  playlistId: PropTypes.string,
  showModal: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  handleSaveClick: PropTypes.func,
};

export default PlaylistEditInterface;
