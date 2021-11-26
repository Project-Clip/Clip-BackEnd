var {google} = require('googleapis');
var service = google.youtube('v3');
var exports = (module.exports = {});
var fs = require('fs');
/*const Fileread = require('./Fileread.js');

console.log('받아온 API키입니다.' + Fileread);*/

exports.Data = function (tokenkey, callback) {
	service.playlists.list(
		{
			key: 'AIzaSyADYJgNuh0hvCN_07d4ZF4Snb9KficArr8', //googleAPI에서 부여받은 개인 keyz
			channelId: 'UCid83oPnsL-4ZEo8CyQr6Rg', //플레이리스트 오리지널의 id값
			part: 'snippet',
			fields: 'nextPageToken, pageInfo, items(id, snippet(title, description, publishedAt, channelId, channelTitle, tags(), thumbnails(high(url))))',
			//api로 요청할 정보(재생목록ID, 채널ID, 재생목록, 제목, 내용, 재생목록 업로드 날짜, 채널 이름, 카테고리, 썸네일 : default는 썸네일의 기본해상도입니다. 고해상도의 이미지를 원하면 default를 high로 바꾸시면 됩니다.
			maxResults: 50, //요청한 정보를 반환 할 최대 항목 수를 설정할 수 있는 매개변수입니다. 최소 5부터 50까지 설정 가능하며, 만약 반환할 최대항목 수가 50이 넘는다면 nextpageToken키를 이용하여 해결하시면 됩니다.
			pageToken: tokenkey,
		},
		function (err, response) {
			if (err) {
				//에러 났을 때
				console.log('The API returned an error : ' + err);
				return;
			}
			var playlist = response.data.items;
			if (playlist.length == 0) {
				// 가져온거 없을 때
				console.log('검색 결과 없음.');
			} else {
				// let playlistNum = 0;
				let playlistData = []; //반환 된 정보 push할 변수
				const test = response.data;

				/*while (playlistNum < playlist.length) {
					if (playlist[playlistNum].id == latestId) {
						//만약 현재 Api로 요청하는 정보가 Database에서 가져온 id값과 일치하는 경우, Api요청을 중지합니다.
						break;
					}
					playlistData.push(playlist[playlistNum]);
					playlistNum++;
				}*/
				return callback(test); //module로 내보낼 정보
			}
		},
	);
};
