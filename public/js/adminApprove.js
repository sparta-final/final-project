$(document).ready(function () {
  getBeforeApproveGym();
});

function getBeforeApproveGym() {
  axios({
    method: 'get',
    url: '/api/admin/beforeApprove',
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
              <button onclick="location.href='/" class="gym-detial-btn">업체 상세 정보</button>
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
//     .put('api/blackList', {
//       email: blacklist_email,
//       blacklist: blacklist_checked,
//     })
//     .then((response) => {
//       const data = response.data;
//       let memberAll = data.reduce(function add(sum, cur) {
//         return sum + cur;
//       });

//       let temp = `
//         <p class='admin-membership'>구독 회원 <span>${memberAll.toLocaleString()}</span> 명</p>
//         <ul class='admin-member-type'>
//           <li class='admin-basic'>Basic <span>${data[0].toLocaleString()}</span> 명</li>
//           <li class='admin-standard'>Standard <span>${data[1].toLocaleString()}</span> 명</li>
//           <li class='admin-premium'>Premium <span>${data[2].toLocaleString()}</span> 명</li>
//         </ul>`;
//       $('.admin-members').append(temp);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }
