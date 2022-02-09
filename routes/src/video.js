const { google } = require('googleapis');
const service = google.youtube('v3');

exports.Data = function (videoid, callback) {
  service.videos.list(
    {
      key: process.env.key, // googleAPI에서 부여받은 개인 key
      id: videoid, // 영상파일의 ID
      part: 'snippet,statistics', // 요청할 정보 종류
      fields:
        'items(snippet(title, description, channelId), statistics(likeCount))',
      // id에서 가져올 정보(영상제목, 내용, 채널ID, 조회수, 좋아요 수)
    },
    function (err, response) {
      if (err) {
        // 문제 있을 때
        console.log('(Video.js) The API returned an error:' + err);
        return;
      }
      const video = response.data.items; // 반환 된 정보 변수로 지정
      if (video.length === 0) {
        console.log('검색 결과 없음.');
      } else {
        const params = [];
        // Request data 등록
        const record = [];
        const snippet = video[0].snippet;
        const like = video[0].statistics;
        record.push(
          videoid,
          snippet.title,
          snippet.description,
          snippet.channelId,
          like.likeCount
        );
        params.push(record);

        return callback(params);
      }
    }
  );
};
