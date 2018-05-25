import React, { Component } from 'react';
import './App.css';
import {FormGroup, FormControl, InputGroup, ListGroup, ListGroupItem, Table } from 'react-bootstrap';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

// Add caching? MongoDB?
// Add genre ranking?
// Remind user to login, timeout

class App extends Component {

  constructor(props){
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
	
	this.userID = '';
	this.songID = '';
	this.songTitle = '';
	this.playlistID = '';
	this.playlistResults = [];
	this.songArray = [];
	
    this.state = {
	  search: '',
	  searchResults: [],
      loggedIn: token ? true : false,
	  playlistURL: '',
	  errorMessage: '',
    }
  }	
  
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }
  
  getCredentials(){
    spotifyApi.getMe()
      .then((response) => {
		  if (response.status === 401) {
			  this.setState({errorMessage: 'Session timed out. Please login and try again'});
			  return;
		  }
		  this.userID = response.id;
      })
  }
  
  getSearchResults(){
	if (!this.state.search) return;
	
	this.getCredentials();
	
	spotifyApi.searchTracks(this.state.search).then((response) => {
		var results = [];
		var firstPage = response.tracks.items;
		if (response.tracks.total === 0){
			this.setState({errorMessage: 'No results found! Please try again'});
			return;
		} 
		this.setState({errorMessage: ''});
	    firstPage.forEach(function(track, index) {
		  results.push({
			  name: track.name,
			  artist: track.artists[0].name,
              id: track.id,
		  });
		});
	  
		this.setState({searchResults: results});
    })
  }
  
  getTracks(user_id, playlist_id){
	  spotifyApi.getPlaylistTracks(user_id, playlist_id).then((response) => {
	  var results = [];
	  var firstPage = response.items;
	  
	  firstPage.forEach(function(item, index) {
		  results.push_back(item.track.uri);
	  });
	  return results;
	})
  }
  
  createPlaylist(){
	spotifyApi.createPlaylist(this.userID, { 'name' : this.songTitle , 'public' : false }).then((response) => {
      this.playlistID = response.id;
	  this.addSongsToPlaylist();
	  this.setState({playlistURL: response.external_urls.spotify});
    })
  }
  
  addSongsToPlaylist(){
	var i = 0;	
	while (i < this.songArray.length){
		var songChunk = this.songArray.slice(i,i+99);
		JSON.stringify(songChunk);
		i = i + 99;
		spotifyApi.addTracksToPlaylist(this.userID, this.playlistID, songChunk, 'position=' + i);
	}
	
  }
  
  getPlaylistResults(track, id, artist){
	this.songTitle = track;
	this.songID = id;
	
	this.getCredentials();
	
    spotifyApi.searchPlaylists('"' + artist + ' – ' + track + '"').then((response) => {
		var results = [];
		var firstPage = response.playlists.items;
		firstPage.forEach(function(playlist, index) {
			results.push({
				id: playlist.id,
				owner: playlist.owner.id,
			});
	  });
	  this.playlistResults = results;
	  this.checkPlaylistsAndGetTracks();
	})
  }
  
  checkPlaylistsAndGetTracks(){
	var songList = {};
	var songID = this.songID;
	
	// Get tracks from loaded playlists
	// Check if they contain chosen track
	var promises = this.playlistResults.map(function(item){
		return new Promise(function(resolve, reject){
			spotifyApi.getPlaylistTracks(item.owner, item.id).then((response) => {
				var relevant = false;
				var results = response.items;
				if (!results){
					reject('ERROR');
				} 
				results.forEach(function(item){
					if (item.track.id === songID){
						relevant = true;
					}
				});
				if (relevant){
					results.forEach(function(item){
						if (songList.hasOwnProperty(item.track.uri)){
							songList[item.track.uri]++;
						}
						else{
							songList[item.track.uri] = 1;
						}
					});
				}
				resolve(songList);
			})
		});
	});
	
	Promise.all(promises).then(function(songList) {
		var songArr = [];
		this.songArray = [];
		//Push songs into array to sort them by occurrence frequency
		
		for (var song in songList[0]) {
			songArr.push([song, songList[0][song]]);
		}
		
		songArr.sort(function(a, b) {
			return b[1] - a[1];
		});
		
		for (var i = 0 ; i < songArr.length; i++)
		{
			this.songArray[i] = songArr[i][0];
		}
		this.createPlaylist();
		
	}.bind(this)).catch(function(error) {
	});
  }
  
  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888' >Login to Spotify </a>
        { this.state.loggedIn &&
			<FormGroup>
			  <InputGroup>
                <FormControl
                  type="text"
                  placeholder= "Search for a track"
                  value = {this.state.search}
                  onChange= {event => {
					  this.setState({search : event.target.value})}}
                  onKeyPress={event => {
                  if(event.key === 'Enter'){
                    this.getSearchResults();
				  }
				}}
                />
			  <button onClick={() => this.getSearchResults()}>
                Search
              </button>
			  {this.state.errorMessage}
		</InputGroup>
		<table className="table table-hover">
		{this.state.searchResults.length !== 0 &&
		  <thead>
		    <tr>
				<th>Title</th>
				<th>Artist</th>
			</tr>
		  </thead>
		}
	      <tbody>
			{this.state.searchResults.map((track) => (
			<tr onClick={() => this.getPlaylistResults(track.name, track.id, track.artist)}>
			    <td>{track.name}</td><td>{track.artist}</td>
			</tr>
			))}
		  </tbody>
		</table>
		</FormGroup>
		}
		{this.state.playlistURL.length !== 0 && 
			<a href={this.state.playlistURL}>{this.state.playlistURL}</a>
		}
      </div>
    );
  }
}
export default App;