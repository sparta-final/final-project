$(document).ready(function () {
  getFeeds();
});

function getFeeds() {
  axios({
    method: 'get',
    url: 'api/feed',
  })
    .then((response) => {
      const data = response.data;
      console.log('✨✨✨', data, '✨✨✨');

      for (let i in data) {
        let feedsImg = data[i].feedsImgs[0].image;
        let id = data[i].id;
        let nickname = data[i].user.nickname;
        let profileImg = data[i].user.profileImage;
        let content = data[i].content;

        let temp = `
        <div class="feed-user-wrap">
        <img src="${profileImg}" alt="" class="feed-profile" />
        <p class="feed-user-name">${nickname}</p>
        <ul class="feed-user-control">
        <span></span><span></span><span></span>
            <li class="feed-update" onclick="${id}" >수정하기</li>
            <li class="feed-delete" onclick="${id}" >삭제하기</li>
          </ul>
        </div>
        <img src="${feedsImg}" alt="" class="feed-image" />
        <div class="feed-content-wrap">
          <p class="feed-content"><span>${nickname}</span>${content}</p>
          <p class="feed-comments" onclick="${id}" >댓글보기</p>
        </div>  
        `;
        $('.feed-container').append(temp);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
