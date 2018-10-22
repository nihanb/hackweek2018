import axios from 'axios';

export function getCurrentUserProfile(token) {
  return axios
    .get('https://api.spotify.com/v1/me', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
}

export function getPlaylists(token) {
  return axios
    .get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
}

export function getPlaylistDetails(token, userId, playlistId) {
  return axios.get(
    `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );
}

export function savePlaylist(token, userId, playlistId, data) {
  return axios
    .request({
      url: `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}`,
      method: 'put',
      data: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
}
