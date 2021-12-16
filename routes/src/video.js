const { google } = require('googleapis');
const service = google.youtube('v3');

exports.Data = function (videoid, callback) {
  service.videos.list(
    {
      key: 'AIzaSyADYJgNuh0hvCN_07d4ZF4Snb9KficArr8', // googleAPI에서 부여받은 개인 key
      id: videoid, // 영상파일의 ID
      part: 'snippet,statistics', // 요청할 정보 종류
      fields:
        'items(snippet(title, description, channelId), statistics(likeCount))',
      // id에서 가져올 정보(영상제목, 내용, 채널ID, 조회수, 좋아요 수)
    },
    function (err, response) {
      if (err) {
        // 문제 있을 때
        console.log('The API returned an error:' + err);
        return;
      }
      const video = response.data.items; // 반환 된 정보 변수로 지정
      if (video.length == 0) {
        console.log('검색 결과 없음.');
      } else {
        const videoData = video[0]; // video[0] 정보를 videoData로 선언
        // console.log('제목 : ' + video[0].snippet.title); //가져온 영상 정보 출력
        // console.log('설명 : ' + video[0].snippet.description);
        // console.log('채널 id : ' + video[0].snippet.channelId);
        // console.log('좋아요 수 : ' + video[0].statistics.likeCount);
        // console.log(params);
        console.log('반환된 영상 정보입니다.' + videoData);
        return callback(videoData);
      }
    }
  );
};
