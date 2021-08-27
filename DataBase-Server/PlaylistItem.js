var { google } = require('googleapis');
var service = google.youtube('v3');
var exports = (module.exports = {});

exports.Data = function (callback) {
	service.playlistItems.list(
		{
			playlistId: 'PL920OTfqSyzcyEAPWvePd5leialysnmJb', //재생목록의 id값
			key: 'AIzaSyADYJgNuh0hvCN_07d4ZF4Snb9KficArr8', //googleAPI에서 부여받은 개인 key
			part: 'snippet',
			fields: 'nextPageToken, pageInfo, items(id, snippet(channelId, resourceId(videoId)))',
			//api로 요청할 정보(영상의 고유ID, 채널ID, 영상 ID)
			maxResults: 5, //요청한 정보를 반환 할 최대 항목 수를 설정할 수 있는 매개변수입니다. 최소 5부터 50까지 설정 가능하며, 만약 반환할 최대항목 수가 50이 넘는다면 nextpageToken키를 이용하여 해결하시면 됩니다.
		},
		function (err, response) {
			if (err) {
				//에러 났을 때
				console.log('The API returned an error:' + err);
				return;
			}
			var playlistItem = response.data.items;
			if (playlistItem.length == 0) {
				// 가져온거 없을 때
				console.log('검색 결과 없음.');
			} else {
				let playlistItemNum = 0;
				let playlistItemData = []; //반환 된 정보 push할 변수
				while (playlistItemNum < playlistItem.length) {
					// console.log('채널 id : ' + playlistItemData.snippet.channelId);
					// console.log('영상 id : ' + playlistItemData.snippet.resourceId.videoId);
					playlistItemData.push(playlistItem[playlistItemNum]);
					// console.log(playlistItemData);
					playlistItemNum++;
					if (playlistItemNum == playlistItem.length) {
						return callback(playlistItemData);
					}
				}
			}
		},
	);
};
