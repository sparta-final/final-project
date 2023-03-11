$(document).ready(function () {
  const url = window.location.pathname.split('/');
  const id = url[url.length - 1];

  getApproveGymDetail(id);
  // $('.gym-detail-desc')
  const targetTextarea = document.querySelector(`.gym-detail-desc`);
  const rowCount = targetTextarea.value.split(/\r\n|\r|\n/).length;
  targetTextarea.style.height = rowCount * 24 + 'px'; //줄 수에 따라서 높이를 조절
});

function getApproveGymDetail(id) {
  axios({
    method: 'get',
    url: `/api/admin/beforeApprove/${id}`,
  })
    .then((response) => {
      const data = response.data;
      console.log('✨✨✨', data, '✨✨✨');
      let name = data[0].name;
      let address = data[0].address;
      let phone = data[0].phone;
      let description = data[0].description;
      let certification = data[0].certification;
      // 이미지 가져오는 로직 필요
      // for (let i in data) {
      //   let img = `<li><img src="${data[i]}" id="main-img" /></li>`;
      //   $('.bxslider').append(img);
      // }

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
      <button class="approve-btn" onclick="approveGym(${id})">제휴업체 승인하기</button>
      `;
      $('.approveDetail-container').append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}

function approveGym(id) {
  axios
    .put('/api/admin/approve', {
      id: id,
    })
    .then((response) => {
      alert('협력업체로 등록되었습니다.');
      window.location.replace(`/admin/approve`);
    })
    .catch((err) => {
      console.log(err);
    });
}
