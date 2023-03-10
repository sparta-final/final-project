$(document).ready(function () {
  let id = window.location.pathname.split('/')[2];
  getFeedUser(id);
});

function getFeedUser(id) {
  axios({
    method: 'get',
    url: `/api/feed/${id}/user`,
  })
    .then((response) => {
      const data = response.data;
      console.log('✨✨✨', data, '✨✨✨');
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
      console.log('✨✨✨', data, '✨✨✨');
      for (let i in data) {
        let commentNickname = data[i].user_nickname;
        let commentUserImg = data[i].user_profileImage;
        let comments = data[i].comments_comment;
        let comments_id = data[i].comments_id;
        let commentsUserId = data[i].comments_user_id;

        let token = localStorage.getItem('at');
        let tokenPayload = token ? token.split('.')[1] : null;
        let decodedPayload = tokenPayload ? atob(tokenPayload) : null;
        let parsedPayload = decodedPayload ? JSON.parse(decodedPayload) : null;

        console.log('comments_id', comments_id);

        console.log('parsedPayload', parsedPayload);

        if (parsedPayload === null) {
          parsedPayload = { sub: 0 };
        }

        console.log('parsedPayload.sub', parsedPayload.sub);

        if (commentsUserId === parsedPayload.sub) {
          let temp = `
          
        <div class="comment-user-wrap">
        <button class="comment-delete-btn" onclick="commentDelete(${data[i].comments_id})">삭제</button>
        <img src="${commentUserImg}" alt="" class="feed-profile" />
        <p class="comment-user-name">${commentNickname}</p>
        <p class="comment-content">${comments}</p>
        </div>

        `;
          $('.comment-container').append(temp);
        } else {
          let temp = `
        <div class="comment-user-wrap">
        <img src="${commentUserImg}" alt="" class="feed-profile" />
        <p class="comment-user-name">${commentNickname}</p>
        <p class="comment-content">${comments}</p>
        </div>
        `;
          $('.comment-container').append(temp);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function commentAdd() {
  const userType = localStorage.getItem('type');
  if (userType !== 'user') {
    alert('일반 로그인이 필요한 서비스입니다.');
    window.location.href = '/user/login';
  }
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

function commentDelete(id) {
  if (confirm('작성한 댓글을 삭제하시겠습니까?') === true) {
    let feedId = window.location.pathname.split('/')[2];
    axios
      .delete(`/api/feed/${feedId}/comment/${id}`, {
        headers: {
          accesstoken: `${localStorage.getItem('at')}`,
          refreshtoken: `${localStorage.getItem('rt')}`,
        },
      })
      .then((res) => {
        window.location.replace(`/feed/${feedId}/comments`);
        alert('댓글이 삭제되었습니다.');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
