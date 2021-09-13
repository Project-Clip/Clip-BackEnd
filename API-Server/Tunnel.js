var Video = require('./Video.js');
var PlaylistItem = require('./PlaylistItem.js');
var Playlist = require('./Playlist.js');
const {response} = require('express');
var exports = (module.exports = {});

// Playlist.Data(undefined, function (response) {
// 	console.log('가져온 정보입니다. : ' + response[0].snippet.title); //반복문으로 돌려두면 됩니다.
// 	NoNameFunc(response);
// });

NoNameFunc = (response, apicode) => {
	//아직 이름을 못지어 주었습니다.. Playlist와 Video의 Id값을
	console.log(response.length);
	let pagetoken = undefined;
	if (response.length == 50) {
		console.log('요청한 정보가 50개 이상입니다.');
		pagetoken = 'CDIQAA';
		console.log(apicode);
		if (apicode == 'playlist') {
			PlayList(pagetoken);
		} else if (apicode == 'playlistitem') {
			PlayListItem(pagetoken);
		}
	} else {
		console.log('요청한 정보가 50개 이하입니다.');
		// console.log(response)
		PlayList(pagetoken);
	}
};

PlayList = (token) => {
	//이게 애초에 50개 이하면 어쩌려고..?
	const apicode = 'playlist';
	console.log('token입니다. ' + token);
	Playlist.Data(token, function (response) {
		console.log('가져온 정보입니다. : ' + response[0].snippet.title); //반복문으로 돌려두면 됩니다.
		//조건문으로 stop 해줍시다.
		if (response.length == 50) {
			NoNameFunc(response, apicode);
		}
	});
};

PlayListItem = (token) => {
	const apicode = 'playlistitem';
	PlaylistItem.Data(token, function (response) {
		console.log('가져온 정보입니다. : ' + response[0].snippet); //반복문으로 돌려두면 됩니다.
		NoNameFunc(response, apicode);
	});
};

Video = () => {
	const apicode = video;
	Video.Data(function (response) {
		console.log('가져온 정보입니다.' + response);
	});
};

PlayList(undefined);
