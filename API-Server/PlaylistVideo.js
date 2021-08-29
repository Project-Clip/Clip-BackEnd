var { google } = require('googleapis');
var service = google.youtube('v3');

service.playlistItems.list(
	//재생목록에 포함 된 영상정도 가져오기
	{
		playlistId: 'PLqqQvcAR1H0ksy7T-vGHDlbqGOCpx8OXC' /*'PL_nJXfU08-BASBpz8C2JHgvbFScMpP-m4'*/, //재생목록의 id값
		key: 'AIzaSyADYJgNuh0hvCN_07d4ZF4Snb9KficArr8', //googleAPI에서 부여받은 개인 key
		part: 'snippet',
		fields: 'nextPageToken, pageInfo, items(id, snippet(channelId, resourceId(videoId)))', //api로 요청할 정보(영상의 고유ID, 채널ID, 영상 ID)
		maxResults: 30, //요청할 영상의 최대 갯수
	},
	function (err, response) {
		if (err) {
			//에러 났을 때
			console.log('The API returned an error:' + err);
			return null;
		}
		let playlistVideo = response.data.items; //봔환 된 정보를 변수로 지정
		if (playlistVideo.length == 0) {
			//재생목록안에 동영상이 없을 때
			console.log('검색 결과 없음.');
			return null;
		} else {
			let countPlaylistVideoList = 0;
			while (countPlaylistVideoList < playlistVideo.length) {
				let videoId = playlistVideo[countPlaylistVideoList].snippet.resourceId.videoId; //영상파일의 ID를 변수로 지정
				console.log(playlistVideo[countPlaylistVideoList]); //요청한 재생목록의 정보 출력

				service.videos.list(
					//하나의 영상 세부정보 가져오기
					{
						key: 'AIzaSyADYJgNuh0hvCN_07d4ZF4Snb9KficArr8', //googleAPI에서 부여받은 개인 key
						id: videoId, //동영상 id
						part: 'snippet,statistics',
						fields: 'items(snippet(title, description, channelId), statistics(likeCount))', //id에서 가져올 정보(영상제목, 내용, 채널ID, 조회수, 좋아요 수)
					},
					function (err, response) {
						if (err) {
							//문제 있을 때
							console.log('The API returned an error:' + err);
							return null;
						}
						let video = response.data.items;
						if (video.length == 0) {
							console.log('검색 결과 없음.');
						} else {
							// console.log(JSON.stringify(video, null, 4)); //가져온 영상 정보 출력
							console.log('제목 : ' + video[0].snippet.title); //가져온 영상 정보 출력
							console.log('설명 : ' + video[0].snippet.description);
							console.log('채널 id : ' + video[0].snippet.channelId);
							console.log('좋아요 수 : ' + video[0].statistics.likeCount);
						}
					},
				);

				countPlaylistVideoList++;
			}
		}
	},
);
