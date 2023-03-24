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
    url: `/api/feed/hello/${id}/comment`,
  })
    .then((response) => {
      const data = response.data;
      for (let i in data) {
        let commentNickname = data[i].user_nickname;
        let commentUserImg = data[i].user_profileImage;
        let comments = data[i].comments_comment;
        let comments_id = data[i].comments_id;
        let commentsUserId = data[i].comments_user_id;

        /**
         * 작성한 댓글 작성자만 삭제 버튼이 보이도록 하는 로직
         * @author 주현진
         */

        let token = localStorage.getItem('at');
        let tokenPayload = token ? token.split('.')[1] : null;
        let decodedPayload = tokenPayload ? atob(tokenPayload) : null;
        let parsedPayload = decodedPayload ? JSON.parse(decodedPayload) : null;
        if (parsedPayload === null) {
          parsedPayload = { sub: 0 };
        }

        if (commentsUserId === parsedPayload.sub) {
          let temp = `
          
        <div class="comment-user-wrap">
        <button class="comment-delete-btn" onclick="commentDelete(${data[i].comments_id})">x</button>
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
      if (err.response.status === 403) {
        alert('로그인이 필요한 서비스입니다.');
        window.location.href = '/user/login';
      }
      console.log('err', err);
    });
}

/**
 * 댓글 삭제 버튼
 * @author 주현진
 */

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
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
