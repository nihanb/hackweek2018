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
      const playlist = this.props.playlist;
      const index = this.props.index;
      this.setState({
        contentLoading: false,
        playlist,
        playlistName: playlist.name,
        trackComment: typeof(index) !== 'undefined' && playlist.tracks[index].comment ? playlist.tracks[index].comment : null,
      });
  }

  render() {
    const { contentLoading,
      playlist,
      trackComment,
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
              <form className="editorbody" id="editorbody">
                <div className="editimageanddescription">
                  <div className="editdescription">
                    <div className="label">Comment</div>
                    <textarea className="descriptiontextarea" name="description" value={trackComment ? trackComment : ''} onChange={(event) => this.setState({trackComment: event.target.value})} />
                  </div>
                </div>
                <div className="editconfirm">
                  {canEdit ?
                    <div>
                      <button className="btn btn-default btn-xs btncancel" onClick={this.props.handleCloseModal}>Close</button>
                      <button className="btn btn-primary btn-xs btnsave" onClick={(event)=>{
                        event.preventDefault();
                        this.props.handleSaveClick(
                          this.props.index,
                          playlist.id,
                          trackComment);
                          this.props.handleCloseModal();
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
  index: PropTypes.int,
  showModal: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  handleSaveClick: PropTypes.func,
};

export default PlaylistEditInterface;
