$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = +urlParams.get('id');
  getThisGym(id);
});
// 선택한 가게 수정페이지
function getThisGym(id) {
  axios
    .get(`/api/gym/list/${id}`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      const data = res.data;
      const id = data.id;
      const name = data.name;
      const phone = data.phone;
      const gymType = data.gymType;
      const description = data.description;
      const certification = data.certification;
      const gymImgs = data.gymImgs;

      const temp_html2 = `
      <input type="text" id="gymName-up" />
      <input type="text" id="gymPhone-up" />
      <textarea
        name="gymDescription"
        id="gymDescription-up"
        class="postGymInput gym-intro"
        wrap="hard"
      ></textarea>
      <div class="certifi-wrap">
        <input class="certifi-upload-name" value="" placeholder="사업자 등록증 수정하기" />
        <label for="gymCertification" class="gym-certifi-img">+</label>
        <input type="file" id="gymCertification" />
      </div>
      <div class="gym-img-wrap">
        <input class="gym-upload-name" value="" placeholder="헬스장 이미지 수정하기" />
        <label for="gymImgs" class="gym-imgs-upload">+</label>
        <input type="file" id="gymImgs" multiple />
      </div>
      <input type="button" class="gym-create-btn" onclick="updateGym(${id})" value="가맹점 수정" />
      <input type="hidden" id="gymType" value="${gymType}" />
      <input type="hidden" id="certification" value="${certification}" />
      `;
      $('#thisGym').append(temp_html2);
      for (let i in gymImgs) {
        let img = `<input type="hidden" id="gymImgsUrl" value="${gymImgs[i].img}" />`;
        $('#thisGym').append(img);
      }
      $('#gymName-up').attr('value', name);
      $('#gymPhone-up').attr('value', phone);
      $('#gymDescription-up').html(description);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 가게 수정
function updateGym(id) {
  const name = document.getElementById('gymName-up').value;
  const phone = document.getElementById('gymPhone-up').value;
  const description = document.getElementById('gymDescription-up').value;
  const certification = document.getElementById('gymCertification');
  const gymType = document.getElementById('gymType').value;
  const imgList = document.getElementById('gymImgs').files;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('description', description);
  formData.append('certification', certification.files[0]);
  formData.append('gymType', gymType);
  for (let i = 0; i < imgList.length; i++) {
    formData.append('img', imgList[i]);
  }

  axios
    .put(`/api/gym/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      console.log(res);
      alert('수정 완료!');
      window.location.href = '/business/businessMyInfo';
    })
    .catch((err) => {
      console.log(err);
    });
}
