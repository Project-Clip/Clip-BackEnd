const { count } = require('console');
var { google } = require('googleapis');
var service = google.youtube('v3');

service.playlists.list(
	{
		key: 'AIzaSyADYJgNuh0hvCN_07d4ZF4Snb9KficArr8', //googleAPI에서 부여받은 개인 keyz
		channelId: 'UCid83oPnsL-4ZEo8CyQr6Rg', //플레이리스트 오리지널의 id값
		part: 'snippet',
		fields:
			'prevPageToken, nextPageToken, items(id, snippet(title, description, publishedAt, channelId, channelTitle, tags(), thumbnails(high(url))))',
		//api로 요청할 정보(영상의 고유ID, 채널ID, 재생목록 제목, 내용, , 재생목록 업로드 날짜, 채널 이름, 카테고리, 썸네일 : default는 썸네일의 기본해상도입니다. 고해상도의 이미지를 원하면 default를 high로 바꾸시면 됩니다.)
		maxResults: 3,
	},
	function (err, response) {
		if (err) {
			//에러 났을 때
			console.log('The API returned an error : ' + err);
			return;
		}
		let playlist = response.data.items; //요청한 정보
		if (playlist.length == 0) {
			// 가져온거 없을 때
			console.log('검색 결과 없음.');
		} else {
			let countPlaylist = 0;
			console.log('검색 결과 값 : ' + playlist.length); //검색된 재생목록의 수
			while (countPlaylist < playlist.length) {
				let playlistSnippet = playlist[countPlaylist].snippet;
				console.log('재생목록 id : ' + playlist[countPlaylist].id);
				console.log('생성 날짜 : ' + playlistSnippet.publishedAt);
				console.log('채널 id : ' + playlistSnippet.channelId);
				console.log('제목 : ' + playlistSnippet.title);
				console.log('설명 : ' + playlistSnippet.description);
				console.log('썸네일 : ' + playlistSnippet.thumbnails.high.url);
				console.log('채널 이름 : ' + playlistSnippet.channelTitle);
				// console.log(playlist[countPlaylistVideoList].snippet.tags);
				const playlistId = playlist[countPlaylist].id; //재생목록id
				service.playlistItems.list(
					{
						playlistId: playlistId, //재생목록의 id값
						key: 'AIzaSyADYJgNuh0hvCN_07d4ZF4Snb9KficArr8', //googleAPI에서 부여받은 개인 key
						part: 'snippet',
						fields:
							'prevPageToken, nextPageToken, pageInfo, items(id, snippet(channelId, resourceId(videoId)))',
						//api로 요청할 정보(영상의 고유ID, 채널ID, 영상 ID)
						maxResults: 6,
					},
					function (err, response) {
						if (err) {
							//에러 났을 때
							console.log('The API returned an error:' + err);
							return;
						}
						let video = response.data.items;
						console.log('웹드라마 제목 : ' + playlistSnippet.title);
						console.log('재생목록의 영상 수 : ' + video.length);
						console.log('재생목록ID : ' + playlistId);
						if (video.length == 0) {
							// 가져온거 없을 때
							console.log('검색 결과 없음.');
						} else {
							let countPlaylistVideo = 0; //가져올 영상번호
							while (countPlaylistVideo < video.length) {
								console.log('채널 id : ' + video[countPlaylistVideo].snippet.channelId);
								console.log('영상 id : ' + video[countPlaylistVideo].snippet.resourceId.videoId);
								countPlaylistVideo++;
							}
						}
					},
				);
				countPlaylist++;
			}
		}
	},
);
