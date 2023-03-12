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

let map;
function showPosition(position) {
  // 위도,경도를 주소로 변환
  const geocoder = new kakao.maps.services.Geocoder();
  const coord = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
  geocoder.coord2Address(coord.getLng(), coord.getLat(), function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      x.innerHTML = result[0].address.address_name;
    }
    // div id="kakao-map"에 현재 위치 기반 지도를 표시
    const container = document.getElementById('kakao-map');
    container.style.width = '100%';
    container.style.height = '550px';
    const options = {
      center: new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),
      level: 2,
    };
    map = new kakao.maps.Map(container, options);
    // 지도에 마커와 이름 표시
    axios.get('/api/gym')
      .then((res) => {
        const gyms = res.data;
        for (const gym of gyms) {
          const markerPosition = new kakao.maps.LatLng(gym.lat, gym.lng);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);
          // 커스텀 오버레이
          let content = `
          <div class="customoverlay">
            <a href="/gym/gymDetail?gym=${gym.id}">
              <span class="title">${gym.name}</span>
            </a>
          </div>
          `
          new kakao.maps.CustomOverlay({
            map: map,
            position: markerPosition,
            content: content,
          });
          // 마커에 클릭이벤트를 등록합니다
          kakao.maps.event.addListener(marker, 'click', function () {
            location.href = `/gym/gymDetail?gym=${gym.id}`;
          });
        }
      }
      );
  });
}


/**
 * @description 지도 모달창
 * @author 김승일
 */
const body = document.querySelector('body');
const modal = document.getElementById('modal');
const btnOpenModal = document.querySelector('.map-icon');
const closeBtn = document.querySelector('.close-area');
// 클릭시 이벤트 발생
btnOpenModal.addEventListener('click', () => {
  modal.classList.toggle('show')
  if (modal.classList.contains('show')) {
    body.style.overflow = 'hidden';
  }
  map.relayout()
});
btnOpenModal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
    if (!modal.classList.contains('show')) {
      body.style.overflow = 'auto';
    }
  }
});
closeBtn.addEventListener('click', (e) => {
  if (e.target === closeBtn) {
    modal.classList.remove('show');
    if (!modal.classList.contains('show')) {
      body.style.overflow = 'auto';
    }
  }
});



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
              <button onclick="location.href='/gym/gymDetail?gym=${gymId}'" >업체 상세 정보</button>
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
          <span class="gym-star">⭐${res.data.avgStar}(${reivewsLength})</span>
          `;
    $(`.gym-review-${gymId}`).append(avgStar);
  }
}