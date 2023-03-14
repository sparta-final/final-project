$(document).ready(function () {
  $('textarea.gym-detail-desc').on('keydown keyup', function () {
    $(this)
      .height(1)
      .height($(this).prop('scrollHeight') + 12);
  });

  getBeforeApproveGym();
});

function getBeforeApproveGym() {
  axios({
    method: 'get',
    url: '/api/admin/beforeApprove',
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  })
    .then((response) => {
      const data = response.data;
      console.log('✨✨✨', data, '✨✨✨');
      for (let i in data) {
        let temp = `
          <div class="gym-approve-wait">
            <img src="https://www.spoany.co.kr/ActiveFile/spoany.smms/branch_img/spoany86_20210319102247.jpg" alt="" />
            <ul class="gym-info-box">
              <li class="gym-name">${data[i].name}</li>
              <li class="gym-location">${data[i].address}</li>
              <button onclick="location.href='/admin/approveDetail/${data[i].id}'" class="gym-detial-btn">가맹점 상세 정보</button>
            </ul>
          </div>`;
        $('.approve-wait').append(temp);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// function getBeforeApproveGym() {
//   axios
//     .put('api/admin/approve', {})
//     .then((response) => {
//       console.log('✨✨✨', response, '✨✨✨');
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }
