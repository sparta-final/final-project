$(document).ready(function () {
  let url = window.location.pathname.split('/')[1];
  // console.log('✨✨✨', url, '✨✨✨');

  footerSelect(url);
});

function footerSelect(url) {
  let $footerWrap = $('footer-wrap');
  // console.log('✨✨✨', url === '', '✨✨✨');
  // if (url === '') {
  //   $footerWrap.classList.add;
  // }
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
