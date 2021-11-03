var {google} = require('googleapis');
var service = google.youtube('v3');
var exports = (module.exports = {});
// var Tunnel = require('./Tunnel.js');

exports.Data = function (tokenkey, listid, callback) {
	service.playlistItems.list(
		{
			playlistId: listid, //재생목록의 id값
			key: 'AIzaSyADYJgNuh0hvCN_07d4ZF4Snb9KficArr8', //googleAPI에서 부여받은 개인 key
			part: 'snippet',
			fields: 'nextPageToken, pageInfo, items(id, snippet(channelId, resourceId(videoId)))',
			//api로 요청할 정보(영상의 고유ID, 채널ID, 영상 ID)
			maxResults: 50, //요청한 정보를 반환 할 최대 항목 수를 설정할 수 있는 매개변수입니다. 최소 5부터 50까지 설정 가능하며, 만약 반환할 최대항목 수가 50이 넘는다면 nextpageToken키를 이용하여 해결하시면 됩니다.
			pageToken: tokenkey,
		},
		function (err, response) {
			// console.log('매개변수 작동 점검중입니다 : ' + playlistid);
			if (err) {
				//에러 났을 때
				console.log('The API returned an error:' + err);
				return;
			}
			let playlistItem = response.data.items;
			if (playlistItem.length == 0) {
				// 가져온거 없을 때
				console.log('검색 결과 없음.');
			} else {
				let playlistItemNum = 0;
				let playlistItemData = []; //반환 된 정보 push할 변수
				while (playlistItemNum < playlistItem.length) {
					// const latestId = '4D3wdwyUG6s'; //DataBase에서 가장 최신에 등록 된 ID를 Query하여 변수로 선언합니다.
					console.log('영상 id : ' + playlistItem[playlistItemNum].snippet.resourceId.videoId);
					/*if (playlistItem[playlistItemNum].snippet.resourceId.videoId == latestId) {
						break;
					}*/
					playlistItemData.push(playlistItem[playlistItemNum]);
					// console.log(playlistItemData);
					playlistItemNum++;
				}
				return callback(playlistItemData);
			}
		},
	);
};
