$(document).ready(function () {
  $('.create-feed-btn').css('display', 'block');
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
const limit = 5;
let data = [];

function getGym() {
  if (loading) return;
  loading = true;
  axios
    .get('/api/feed', {
      params: {
        offset: postCount,
        limit,
      },
    })
    .then(async (res) => {
      data = res.data;
      if (postCount === 0) {
        feedContainer.innerHTML = '';
        console.log('✨✨✨', 'data', data, '✨✨✨');
        for (let i = 0; i < limit && i < data.length; i++) {
          //0
          let id = data[i].id;
          const comments = await axios.get(`/api/feed/${id}/comment`)
          const commentsLength = comments.data.length
          let nickname = data[i].user.nickname;
          let profileImg = data[i].user.profileImage;
          let content = data[i].content;
          let temp = `
          <div>
          <div class="feed-user-wrap">
              <img src="${profileImg}" alt="" class="feed-profile" />
              <p class="feed-user-name">${nickname}</p>
              <div id="control-show">
                <ul class="feed-user-control">
                <li class="feed-update" onclick="location.href='/feed/update?id=${id}'" >수정하기</li>
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

          let feedsImg = data[i].feedsImgs;
          for (let j = 0; j < feedsImg.length; j++) {
            let feedImg = `            
            <li><img src="${feedsImg[j].image}" alt="" class="feed-image" /></li>
            `;
            $(document.getElementsByClassName('feed-bxslider')[i]).append(feedImg);
          }
          if (feedsImg.length > 1) {
            console.log('✨✨✨', 'test', i, '✨✨✨');
            $(function () {
              $(document.getElementsByClassName('feed-bxslider')[i]).bxSlider({
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

        postCount += limit;
      } else {
        const remainingFeeds = data.slice(postCount);
        const maxFeedsToLoad = Math.min(limit, remainingFeeds.length);
        for (let i = 0; i < maxFeedsToLoad; i++) {
          let id = remainingFeeds[i].id;
          const comments = await axios.get(`/api/feed/${id}/comment`)
          const commentsLength = comments.data.length
          let nickname = remainingFeeds[i].user.nickname;
          let profileImg = remainingFeeds[i].user.profileImage;
          let content = remainingFeeds[i].content;
          let temp = `
          <div>
            <div class="feed-user-wrap">
            <img src="${profileImg}" alt="" class="feed-profile" />
            <p class="feed-user-name">${nickname}</p>
            <div id="control-show">
                <ul class="feed-user-control">
                  <li class="feed-update" onclick="location.href='/feed/update?id=${id}'" >수정하기</li>
                  <li class="feed-delete" onclick="feedDelete(${id})" >삭제하기</li>
                </ul>
            </div>
            </div>
            <ul class="feed-bxslider"></ul>
            <div class="feed-content-wrap">
              <p class="feed-content"><span>${nickname}</span>${content}</p>
              <p class="feed-comments" onclick="location.href='/feed/${id}/comments'" >댓글 ${commentsLength}개 보기</p>
              </div>  
              </div>
              `;
          $('.feed-container').append(temp);

          let feedsImg = data[i + postCount].feedsImgs;
          console.log('✨✨✨', feedsImg, '✨✨✨');
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
          const feed = document.createElement('div.feed-user-wrap');
          observer.observe(feed);
        }
        postCount += maxFeedsToLoad;
      }

      loading = false;
    })
    .catch((err) => {
      console.log(err);
    });
}

getGym();

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && postCount > 0 && postCount < data.length) {
    getGym();
  }
});

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
      alert('삭제가 완료되었습니다.');
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}

// 피드작성 유저타입 확인
body.addEventListener('click', function (e) {
  // console.log('✨✨✨', e.target.classList.value, '✨✨✨');
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
