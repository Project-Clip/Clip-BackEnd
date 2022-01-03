const { google } = require('googleapis');
const service = google.youtube('v3');

exports.Data = function (tokenkey, id, callback) {
  service.playlistItems.list(
    {
      key: process.env.key,
      playlistId: id,
      part: 'snippet',
      fields:
        'nextPageToken, pageInfo, items(id, snippet(channelId, resourceId(videoId)))',
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
      const playlistItem = response.data.items;
      if (playlistItem.length === 0) {
        // 가져온거 없을 때
        console.log('검색 결과 없음.');
      } else {
        let datanum = 0;
        const params = [];
        // Request data 등록
        while (datanum < playlistItem.length) {
          const record = [];
          const snippet = playlistItem[datanum].snippet;
          record.push(id, snippet.channelId, snippet.resourceId.videoId);
          params.push(record);
          datanum++;
        }
        return callback(params);
      }
    }
  );
};
