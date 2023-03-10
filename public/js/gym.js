$(document).ready(function () {
  getLocation();
  getGymList()
})

/**
 * @description 현재 내 주소 가져오기
 * @author 김승일
 */
const x = document.getElementById('current-location');
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = 'Geolocation is not supported by this browser.';
  }
}

function showPosition(position) {
  // 위도,경도를 주소로 변환
  const geocoder = new kakao.maps.services.Geocoder();
  const coord = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
  geocoder.coord2Address(coord.getLng(), coord.getLat(), function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      x.innerHTML = result[0].address.address_name;
    }
  });
}
/**
 * @description 헬스장 리스트를 가져오기
 * @author 김승일
 */
async function getGymList() {
  const response = await axios({
    method: 'get',
    url: '/api/gym',
  });
  const data = response.data;
  // for...of 문으로 순차적으로 처리
  for (const gym of data) {
    let gymId = gym.id;
    let temp = `
          <div class="gym-approve-wait">
            <img src="${gym.gymImgs[0].img}"  alt="" />
            <ul class="gym-info-box">
              <li class="gym-name">${gym.name}</li>
              <li class="gym-location">${gym.address}</li>
              <li class="gym-review-${gymId}"></li>
              <button onclick="location.href='/admin/approveDetail' class="gym-detial-btn">업체 상세 정보</button>
            </ul>
          </div>
          `;
    $('.approve-wait').append(temp);
    const res = await axios({
      method: 'get',
      url: `/api/gym/${gymId}/review`,
    });
    const reivewsLength = res.data.reviews.length;
    let avgStar = `
          <span class="gym-review-star">⭐${res.data.avgStar}(${reivewsLength})</span>
          `;
    $(`.gym-review-${gymId}`).append(avgStar);
  }
}