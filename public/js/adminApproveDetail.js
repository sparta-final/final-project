const userType = localStorage.getItem('type');
if (userType !== 'admin') {
  toastr.warning('접근 권한이 필요합니다.', '경고', { timeOut: 3000, positionClass: "toast-top-center", closeButton: true, progressBar: true, preventDuplicates: true });
  window.location.href = '/';
}

$(document).ready(function () {
  const url = window.location.pathname.split('/');
  const id = url[url.length - 1];

  getApproveGymDetail(id);
});

async function getApproveGymDetail(id) {
  await axios({
    method: 'get',
    url: `/api/admin/beforeApprove/${id}`,
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  })
    .then((response) => {
      const data = response.data;
      let img = data[0].gymImgs;
      let name = data[0].name;
      let address = data[0].address;
      let phone = data[0].phone;
      let description = data[0].description;
      let certification = data[0].certification;

      for (let i = 0; i < img.length; i++) {
        let temp_img = `
        <li><img src="${img[i].img}" id="approve-img" /></li>
        `;
        $('.approve-bxslider').append(temp_img);
      }
      if (img.length > 1) {
        $(function () {
          $('.approve-bxslider').bxSlider({
            stopAutoOnClick: true,
            pager: false,
            controls: false,
            slideWidth: 600,
            autoControlsCombine: true,
            keyboardEnabled: true,
            autoHover: true,
          });
        });
      }

      let temp = `
        <div class="gym-detail-wrap">
        <p class="gym-detail-name">${name}</p>
        <p class="gym-detail-address">${address}</p>
        <p class="gym-detail-phone">${phone}</p>
        <textarea class="gym-detail-desc" name="description" id="" disabled>
        ${description}
      </textarea
        >
      </div>
      <div class="certification-wrap">
        <p>사업자 등록증</p>
        <img src="${certification}" alt="" />
      </div>
      <button class="approve-btn" onclick="approveGym(${id})">제휴가맹점 승인하기</button>
      `;
      $('.approveDetail-container').append(temp);
      const targetTextarea = document.querySelector(`.gym-detail-desc`);
      const rowCount = targetTextarea.value.split(/\r\n|\r|\n/).length;
      targetTextarea.style.height = rowCount * 24 + 'px'; //줄 수에 따라서 높이를 조절
    })
    .catch((err) => {
      console.log(err);
    });
}

async function approveGym(id) {
  await axios
    .put(
      '/api/admin/approve',
      {
        id: id,
      },
      {
        headers: {
          accesstoken: `${localStorage.getItem('at')}`,
          refreshtoken: `${localStorage.getItem('rt')}`,
        },
      }
    )
    .then((response) => {
      toastr.info('협력가맹점으로 등록되었습니다.', '알림', { timeOut: 1500, positionClass: "toast-top-center", closeButton: true, progressBar: true, preventDuplicates: true });
      setTimeout(() => {
        window.location.replace(`/admin/approve`);
      }, 1500);
    })
    .catch((err) => {
      console.log(err);
    });
}
