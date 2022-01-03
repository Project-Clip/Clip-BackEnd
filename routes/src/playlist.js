const { google } = require('googleapis');
const service = google.youtube('v3');
// console.log('' + process.env.apikey);

exports.Data = function (tokenkey, callback) {
  service.playlists.list(
    {
      key: process.env.key, // googleAPI에서 부여받은 개인 keyz
      channelId: 'UCid83oPnsL-4ZEo8CyQr6Rg', // 플레이리스트 오리지널의 id값
      part: 'snippet',
      fields:
        'nextPageToken, pageInfo, items(id, snippet(title, description, publishedAt, channelId, channelTitle, tags(), thumbnails(high(url))))',
      // api로 요청할 정보(재생목록ID, 채널ID, 재생목록, 제목, 내용, 재생목록 업로드 날짜, 채널 이름, 카테고리, 썸네일 : default는 썸네일의 기본해상도입니다. 고해상도의 이미지를 원하면 default를 high로 바꾸시면 됩니다.
      maxResults: 5, // 요청한 정보를 반환 할 최대 항목 수를 설정할 수 있는 매개변수입니다. 최소 5부터 50까지 설정 가능하며, 만약 반환할 최대항목 수가 50이 넘는다면 nextpageToken키를 이용하여 해결하시면 됩니다.
      pageToken: tokenkey,
    },
    function (err, response) {
      if (err) {
        // 에러 났을 때
        console.log('The API returned an error : ' + err);
        return;
      }
      const playlist = response.data.items;
      if (playlist.length === 0) {
        // 가져온거 없을 때
        console.log('검색 결과 없음.');
      } else {
        let datanum = 0;
        const params = [];
        // Request data 등록
        while (datanum < playlist.length) {
          const record = [];
          const data = playlist[datanum];
          const snippet = playlist[datanum].snippet;
          record.push(
            data.id,
            snippet.title,
            snippet.description,
            snippet.publishedAt,
            snippet.channelId,
            snippet.channelTitle,
            snippet.thumbnails.high.url
          );
          params.push(record);
          datanum++;
        }
        return callback(params); // module로 내보낼 정보
      }
    }
  );
};
