const userType = localStorage.getItem('type');
if (userType !== 'user') {
  alert('일반 로그인이 필요한 서비스입니다.');
  window.location.href = '/user/login';
}

function enrollFeed() {
  const content = document.getElementsByClassName('feed-textarea')[0].value;
  const feedImg = document.getElementById('feedImg').files;
  const formData = new FormData();
  formData.append('content', content);
  for (let i in feedImg) {
    formData.append('feedImg', feedImg[i]);
  }
  axios
    .post('/api/feed', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      console.log('res', res);
      window.location.replace('/feed');
    })
    .catch((err) => {
      console.log('err', err);
      if (res.status === 403) {
        alert('로그인이 필요한 서비스입니다.');
        window.location.href = '/mypage';
      }
    });
}

//  미리보기
function readMultipleImage(input) {
  // console.log(input.files[3]);
  const feedPreviewImg = document.getElementById('feed-preview-img');
  feedPreviewImg.innerHTML = '';
  if (input.files) {
    const $label = document.getElementsByClassName('feed-img-upload')[0];
    const $uploadBtn = document.getElementsByClassName('feed-upload-btn')[0];
    $label.style.height = '40px';
    $label.style.width = '60%';
    $label.style.marginLeft = '20%';
    $label.style.fontSize = '26px';
    $label.style.padding = '0px';
    $label.style.background = 'none';
    $uploadBtn.style.display = 'block';
    const fileArr = Array.from(input.files);
    const $colDiv1 = document.createElement('ul');
    $colDiv1.classList.add('feed-bxslider');
    fileArr.forEach((file, index) => {
      const reader = new FileReader();
      const $imgDiv = document.createElement('li');
      const $img = document.createElement('img');
      $img.classList.add('preview-img');
      $imgDiv.appendChild($img);
      reader.onload = (e) => {
        $img.src = e.target.result;
      };
      $colDiv1.appendChild($imgDiv);
      reader.readAsDataURL(file);
    });
    feedPreviewImg.appendChild($colDiv1);
    if (input.files.length > 1) {
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
}
// 이벤트 리스너
document.getElementById('feedImg').addEventListener('change', (e) => {
  readMultipleImage(e.target);
});

// textarea 자동 줄바꿈
const textarea = document.getElementsByClassName('feed-textarea')[0];
textarea.addEventListener('input', (e) => {
  const target = e.target;
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
});
