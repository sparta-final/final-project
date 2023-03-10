$(document).ready(function () {
  getMyGym();
});

// 내 가게 가져오기
function getMyGym() {
  axios
    .get('/api/gym/my', {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      console.log(res);

      const data = res.data;

      for (let i = 0; i < res.data.length; i++) {
        const id = data[i].id;
        const name = data[i].name;
        const address = data[i].address;
        const img = data[i].gymImgs[0].img;

        const temp_html = `
                        <div class="image-text-box">
                          <img src="${img}"/>
                          <div class="text-box">
                            <h2>${name}</h2>
                            <p>${address}</p>
                            <div class="review-box">
                              <p>별점</p>
                              <button>리뷰 보기</button>
                            </div>
                            <div class="mybtn">
                              <button onclick="location.href='/userList'">사용자</button> 
                              <button onclick="getThisGym(${id})">수정</button> 
                              <button onclick="deleteGym(${id})">삭제</button>
                            </div>
                          </div>
                        </div>`;
        $('#imageTextBox').append(temp_html);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// 가게 삭제
function deleteGym(id) {
  axios
    .delete(`/api/gym/${id}`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      console.log(res);
      alert('삭제가 완료되었습니다.');
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}

// 선택한 가게 수정페이지
function getThisGym(id) {
  axios
    .get(`/api/gym/${id}`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      console.log(res);

      const data = res.data;
      const id = data.id;
      const name = data.name;
      const phone = data.phone;
      const address = data.address;
      const description = data.description;
      const temp_html2 = `<input type="text" class="postGymInput" placeholder="${name}" id="gymName" />

                          <input type="text" class="postGymInput" placeholder="${phone}" id="gymPhone" />
                      
                          <input type="text" id="address" class="postGymInput" placeholder="${address}" />
                          <input type="button" onclick="execDaumPostcode()" value="주소 검색" /><br />
                      
                          <div id="lat" style="display: none"></div>
                          <div id="lng" style="display: none"></div>
                          <div id="map" style="width: 300px; height: 300px; margin-top: 10px; display: none"></div>
                      
                          <select id="gymType">
                            <option value="1">헬스장</option>
                            <option value="2">필라테스</option>
                            <option value="3">요가</option>
                          </select>
                      
                          <input type="text" class="postGymInput descript" placeholder="${description}" id="gymDescription" />
                      
                          <input type="file" class="postGymInput" id="gymCertification" />
                      
                          <input type="file" class="postGymInput" id="gymImgs" />
                      
                          <input type="button" class="postGymInput btn" onclick="updateGym(${id})" value="수정" /><br />`;
      $('#thisGym').append(temp_html2);

      window.location.href = 'updateGym';
    })
    .catch((err) => {
      console.log(err);
    });
}

// 가게 수정

function updateGym(id) {
  const name = document.getElementById('gymName').value;
  const phone = document.getElementById('gymPhone').value;
  const description = document.getElementById('gymDescription').value;
  const certification = document.getElementById('gymCertification');
  const gymType = document.getElementById('gymType').value;
  const lat = document.getElementById('lat').value;
  const lng = document.getElementById('lng').value;
  const img = document.getElementById('gymImgs');
  const address = document.getElementById('address').value;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('description', description);
  formData.append('certification', certification.files[0]);
  formData.append('gymType', gymType);
  formData.append('lat', lat);
  formData.append('lng', lng);
  formData.append('img', img.files[0]);
  formData.append('address', address);

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
      window.location.href = '/businessMyInfo';
    })
    .catch((err) => {
      console.log(err);
    });
}
