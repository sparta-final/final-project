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
