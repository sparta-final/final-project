$(document).ready(function () {
  $('.gym-detail-desc').on('keydown keyup', function () {
    $(this)
      .height(1)
      .height($(this).prop('scrollHeight') + 12);
  });
});

function approveGym() {
  // 헬스장 찾아서 값 넘겨주기
  axios
    .put('api/admin/approve', {
      // 넘겨줄 값 작성필요
    })
    .then((response) => {
      console.log('✨✨✨', response, '✨✨✨');
    })
    .catch((err) => {
      console.log(err);
    });
}
