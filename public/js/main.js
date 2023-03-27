$(document).ready(function () {
  const userType = localStorage.getItem('type');
  const $partnerBtn = document.querySelector('.partner-btn');
  if (userType === 'user') {
    $partnerBtn.style.display = 'none';
    getUser();
  }
  if (userType === 'admin' || userType === 'business') {
    const $mainSubscribe = document.querySelector('.main-subscribe');
    const $mainAmountWrap = document.querySelector('.main-amount-wrap');
    $mainSubscribe.style.display = 'none';
    $mainAmountWrap.style.display = 'none';
    $partnerBtn.style.display = 'none';
  }
});

function getUser() {
  axios
    .get(`/api/user`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      const membership = res.data.membership;
      const $mainSubscribe = document.querySelector('.main-subscribe');
      const $mainAmountWrap = document.querySelector('.main-amount-wrap');
      const $qrForm = document.querySelector('.qr-form');
      if (membership !== null) {
        $mainSubscribe.style.display = 'none';
        $mainAmountWrap.style.display = 'none';
        $qrForm.style.display = 'block';
        $qrForm.style.height = '600px';
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
}

// bxSlider 사용 참고 : https://github.com/stevenwanderski/bxslider-4
$(function () {
  $('.bxslider').bxSlider({
    auto: true,
    stopAutoOnClick: true,
    pager: false,
    controls: false,
    slideWidth: 600,
    autoControlsCombine: true,
    keyboardEnabled: true,
    autoHover: true,
    // pause: 4000,
  });
});
