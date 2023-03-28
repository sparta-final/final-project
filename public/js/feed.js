$(document).ready(function () {
  $('.create-feed-btn').css('display', 'block');
  getGym();
});

// 무한스크롤

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('show', entry.isIntersecting);
    if (entry.isIntersecting) observer.unobserve(entry.target);
  });
});

const feedContainer = document.querySelector('.feed-container');
let postCount = 0;
let loading = false;
const limit = 6;
let data2 = [];

let token = localStorage.getItem('at');
let tokenPayload = token ? token.split('.')[1] : null;
let decodedPayload = tokenPayload ? atob(tokenPayload) : null;
let parsedPayload = decodedPayload ? JSON.parse(decodedPayload) : null;

if (parsedPayload === null) {
  parsedPayload = { sub: 0 };
}

async function getGym() {
  if (loading) return;
  loading = true;
  await axios
    .get(`/api/feed/${postCount}/${limit}`)
    .then(async (res) => {
      data2 = res.data.allFeed;
      let ing = res.data.key;
      if (ing === 'ing') {
        await getGymLimit(data2);
        loading = false;
      } else {
        await getGymLimit(data2);
        loading = true;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
    getGym();
  }
});

// 자른 데이터 가져오기
async function getGymLimit(data) {
  // feedContainer.innerHTML = '';
  for (let i = 0; i < limit - 1 && i < data.length; i++) {
    data2.push(data[i]);
    let id = data[i].id;
    const comments = await axios.get(`/api/feed/hello/${id}/comment`);
    const commentsLength = comments.data.length;
    let nickname = data[i].user.nickname;
    let profileImg = data[i].user.profileImage;
    let content = data[i].content;
    let userId = data[i].userId;

    if (parsedPayload.sub === userId) {
      let temp = `
    <div>
    <div class="feed-user-wrap">
        <img src="${profileImg}" alt="" class="feed-profile" />
        <p class="feed-user-name">${nickname}</p>
        <div id="control-show">
          <ul class="feed-user-control">
          <li class="feed-update" onclick="updateBtn(${id})" >수정하기</li>
          <input type=hidden value="${data[i].userId}">
            <li class="feed-delete" onclick="feedDelete(${id})" >삭제하기</li>
          </ul>
        </div>
      </div>
      <ul class="feed-bxslider"></ul>
      <div class="feed-content-wrap">

        <p class="feed-content"><span>${nickname}</span>${content}</p>
        <p class="feed-comments" onclick="location.href='/feed/${id}/comments'" >댓글 ${commentsLength}개 보기</p>
        </div>  
        `;
      $('.feed-container').append(temp);
    } else {
      let temp = `
    <div>
    <div class="feed-user-wrap">
        <img src="${profileImg}" alt="" class="feed-profile" />
        <p class="feed-user-name">${nickname}</p>
        
      </div>
      <ul class="feed-bxslider"></ul>
      <div class="feed-content-wrap">

        <p class="feed-content"><span>${nickname}</span>${content}</p>
        <p class="feed-comments" onclick="location.href='/feed/${id}/comments'" >댓글 ${commentsLength}개 보기</p>
        </div>  
        `;
      $('.feed-container').append(temp);
    }

    let feedsImg = data[i].feedsImgs;
    for (let j = 0; j < feedsImg.length; j++) {
      let feedImg = `
      <li><img src="${feedsImg[j].image}" alt="" class="feed-image" /></li>
      `;
      $(document.getElementsByClassName('feed-bxslider')[i + postCount]).append(feedImg);
    }
    if (feedsImg.length > 1) {
      $(function () {
        $(document.getElementsByClassName('feed-bxslider')[i + postCount]).bxSlider({
          auto: false,
          stopAutoOnClick: false,
          pager: false,
          controls: false,
          slideWidth: 420,
          autoControlsCombine: true,
          keyboardEnabled: true,
          autoHover: true,
          // pause: 4000,
        });
      });
    }
  }
  postCount += limit - 1;
}

// 피드 수정/삭제 show & hide
const body = document.querySelector('body');
body.addEventListener('click', function (e) {
  if (e.target.id !== 'control-show' && e.target.id !== 'control-icon') return;
  if (e.target.classList.value === '') {
    e.target.classList = 'show-control';
    $(e.target.children).show();
  } else {
    e.target.classList.remove('show-control');
    $(e.target.children).hide();
  }
});

function feedDelete(id) {
  axios
    .delete(`/api/feed/${id}`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      console.log(res);
      toastr.success('삭제가 완료되었습니다.', '성공', { timeOut: 1500, positionClass: "toast-top-center", closeButton: true, progressBar: true, preventDuplicates: true });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    })
    .catch((err) => {
      alert('삭제 권한이 없습니다.');
      console.log(err);
    });
}

// 피드작성 유저타입 확인
body.addEventListener('click', function (e) {
  if (e.target.classList.value !== 'create-feed-btn') return;
  if (localStorage.getItem('type') !== 'user') {
    alert('로그인 후 이용 가능합니다.');
    window.location.href = '/user/login';
  }
});

// 이미지 슬라이더

function feedImgSlider(img) {
  if (img.files.length > 1) {
    $(function () {
      $('.feed-bxslider').bxSlider({
        auto: false,
        stopAutoOnClick: false,
        pager: false,
        controls: false,
        slideWidth: 420,
        autoControlsCombine: true,
        keyboardEnabled: true,
        autoHover: true,
        // pause: 4000,
      });
    });
  }
}

// 수정하기 버튼 눌렀을 때
function updateBtn(id) {
  body.addEventListener('click', async function (e) {
    if (e.target.classList.value !== 'feed-update') return;
    const userType = localStorage.getItem('type');
    if (userType === null) {
      alert('로그인이 필요한 서비스입니다.');
      window.location.href = '/user/login';
    }

    const loginUserId = await axios.get('/api/loginUser/info', {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    });

    if (loginUserId.data == e.target.nextElementSibling.value) {
      location.href = `/feed/update?id=${id}`;
    } else {
      alert('수정 권한이 없습니다.');
    }
  });
}
