var Video = require('./Video.js');
var PlaylistItem = require('./PlaylistItem.js');
var Playlist = require('./Playlist.js');

// var object = test.AngryDoyoon();
Playlist.Data(function (response) {
	console.log(response);
});
PlaylistItem.Data(function (response) {
	console.log(response);
	// console.log(response[0].snippet.resourceId.videoId);
});
Video.Data(function (response) {
	console.log(response);
});
