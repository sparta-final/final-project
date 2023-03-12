$(document).ready(function () {
  let id = window.location.pathname.split('/')[2];
  getFeedUser(id);
});

function getFeedUser(id) {
  axios({
    method: 'get',
    url: `/api/feed/${id}`,
  })
    .then((response) => {
      const data = response.data;
      let feedNickname = data[0].user_nickname;
      let feedUserImg = data[0].user_profileImage;
      let content = data[0].feeds_content;
      let feedInfo = `
      <img src="${feedUserImg}" alt="" class="feed-profile" />
      <p class="content-user-name">${feedNickname}</p>
      <p class="comment-content">${content}</p>
      `;
      $('.content-user-wrap').append(feedInfo);
      getComments(id);
    })
    .catch((err) => {
      console.log(err);
    });
}
function getComments(id) {
  axios({
    method: 'get',
    url: `/api/feed/${id}/comment`,
  })
    .then((response) => {
      const data = response.data;
      for (let i in data) {
        let commentNickname = data[i].user_nickname;
        let commentUserImg = data[i].user_profileImage;
        let comments = data[i].comments_comment;

        let temp = `
        <div class="comment-user-wrap">
        <img src="${commentUserImg}" alt="" class="feed-profile" />
        <p class="comment-user-name">${commentNickname}</p>
        <p class="comment-content">${comments}</p>
        </div>
        `;
        $('.comment-container').append(temp);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function commentAdd() {
  let id = window.location.pathname.split('/')[2];

  const comment = document.getElementById('create-comment').value;
  console.log('✨✨✨', 'comment', comment, '✨✨✨');

  axios
    .post(
      `/api/feed/${id}/comment`,
      { comment: comment },
      {
        headers: {
          accesstoken: `${localStorage.getItem('at')}`,
          refreshtoken: `${localStorage.getItem('rt')}`,
        },
      }
    )
    .then((res) => {
      window.location.replace(`/feed/${id}/comments`);
    })
    .catch((err) => {
      console.log(err);
    });
}
