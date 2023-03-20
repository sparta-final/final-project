const userType = localStorage.getItem('type');
if (userType !== 'business') {
  alert('사업자 로그인이 필요한 서비스입니다.');
  window.location.href = '/business/login';
}

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
  mapOption = {
    center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
    level: 5, // 지도의 확대 레벨
  };

//지도를 미리 생성
var map = new daum.maps.Map(mapContainer, mapOption);
//주소-좌표 변환 객체를 생성
var geocoder = new daum.maps.services.Geocoder();
//마커를 미리 생성
var marker = new daum.maps.Marker({
  position: new daum.maps.LatLng(37.537187, 127.005476),
  map: map,
});

function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      var addr = data.address; // 최종 주소 변수

      // 주소 정보를 해당 필드에 넣는다.
      document.getElementById('address').value = addr;
      // 주소로 상세 정보를 검색
      geocoder.addressSearch(data.address, function (results, status) {
        console.log('result', results);
        // 정상적으로 검색이 완료됐으면
        if (status === daum.maps.services.Status.OK) {
          var result = results[0]; //첫번째 결과의 값을 활용
          // result.y , result.x 를 저장
          document.getElementById('lat').value = result.y; // 위도
          document.getElementById('lng').value = result.x; // 경도
          // 해당 주소에 대한 좌표를 받아서
          var coords = new daum.maps.LatLng(result.y, result.x);
          // 지도를 보여준다.
          mapContainer.style.display = 'block';
          map.relayout();
          // 지도 중심을 변경한다.
          map.setCenter(coords);
          // 마커를 결과값으로 받은 위치로 옮긴다.
          marker.setPosition(coords);
        }
      });
    },
  }).open();
}

function enrollGym() {
  const name = document.getElementById('gymName').value;
  const phone = document.getElementById('gymPhone').value;
  const description = document.getElementById('gymDescription').value;
  const certification = document.getElementById('gymCertification');
  const gymType = $('input#type-health[name=gymType]:checked').val();
  // const gymType = document.getElementById('gymType').value;
  const lat = document.getElementById('lat').value;
  const lng = document.getElementById('lng').value;
  const img = document.getElementById('gymImgs').files;
  const address = document.getElementById('address').value;
  const formData = new FormData();
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('description', description);
  formData.append('certification', certification.files[0]);
  formData.append('gymType', gymType);
  formData.append('lat', lat);
  formData.append('lng', lng);
  for (let i in img) {
    formData.append('gymImg', img[i]);
  }
  formData.append('address', address);

  // for (let value of formData.values()) {
  //   console.log(value);
  // }

  axios
    .post('/api/gym', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      if (res.status === 201) {
        alert('가맹점 등록 신청이 완료되었습니다.');
        window.location.href = '/business/businessMyInfo';
      }
    })
    .catch((err) => {
      alert(err.response.data.data);
      console.log(err);
    });
}

$('#gymCertification').on('change', function () {
  var fileName = $('#gymCertification').val();
  $('.certifi-upload-name').val(fileName);
});

$('#gymImgs').on('change', function () {
  var fileName = $('#gymImgs').val();
  $('.gym-upload-name').val(fileName);
});
