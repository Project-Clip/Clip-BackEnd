var Video = require('./Video.js');
var PlaylistItem = require('./PlaylistItem.js');
var Playlist = require('./Playlist.js');
const {response} = require('express');
var exports = (module.exports = {});

Playlist.Data('CDIQAA', function (response) {
	console.log('가져온 정보입니다. : ' + response[0].snippet.title); //반복문으로 돌려두면 됩니다.
	// NoNameFunc(response);
	// NoNameFunc(response);
});

function NoNameFunc(response) {
	//아직 이름을 못지어 주었습니다.. Playlist와 Video의 Id값을
	console.log(response.length);
	if (response.length == 50) {
		console.log('요청한 정보가 50개 이상입니다.');
		const nextpagetoken = 'CDIQAA';
		Playlist.Data(response);
		// return nextpagetoken;
	} else {
		console.log('요청한 정보가 50개 이하입니다.');
		// console.log(response)
		return undefined;
	}
}
// var object = test.AngryDoyoon();
