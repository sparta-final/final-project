$(document).ready(function () {
  getLocation();
  getGymList();
});

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

// 마커 클러스터러를 생성합니다
var clusterer;
var markers = [];
let customOverlays = [];

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
    axios.get('/api/gym/all').then((res) => {
      const gyms = res.data;
      for (const gym of gyms) {
        const markerPosition = new kakao.maps.LatLng(gym.lat, gym.lng);
        const marker = new kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
        markers.push(marker);
        // 커스텀 오버레이
        let content = `
          <div class="customoverlay">
            <a href="/gym/gymDetail?gym=${gym.id}">
              <span class="title">${gym.name}</span>
            </a>
          </div>
          `;
        const customOverlay = new kakao.maps.CustomOverlay({
          map: map,
          position: markerPosition,
          content: content,
        });

        customOverlays.push(customOverlay);

        function removeCustomOverlays() {
          for (let i = 0; i < customOverlays.length; i++) {
            customOverlays[i].setMap(null);
          }
          customOverlays.length = 0;
        }

        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function () {
          location.href = `/gym/gymDetail?gym=${gym.id}`;
        });

        // 클러스터러가 생성되어 있으면 마커를 추가하고, 없으면 생성합니다
        if (!clusterer) {
          clusterer = new kakao.maps.MarkerClusterer({
            map: map,
            averageCenter: true,
            minLevel: 10,
          });
          kakao.maps.event.addListener(clusterer, 'clustered', removeCustomOverlays);
        }
      }
      clusterer.addMarkers(markers);
    });
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
  modal.classList.toggle('show');
  if (modal.classList.contains('show')) {
    body.style.overflow = 'hidden';
  }
  map.relayout();
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
 * @author 김승일, 정호준
 */

// 무한스크롤
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('show', entry.isIntersecting);
    if (entry.isIntersecting) observer.unobserve(entry.target);
  });
});

const gymContainer = document.querySelector('.approve-wait');
let postCount = 0;
let loading = false;
const limit = 8;
let data = [];

async function getGymList() {
  if (loading) return;
  loading = true;
  const response = await axios({
    method: 'get',
    url: '/api/gym/approveGym',
    params: {
      offset: postCount,
      limit,
    },
  });
  const responseData = response.data;
  console.log('✨✨✨', responseData, '✨✨✨');
  data = [...data, ...responseData];
  if (postCount === 0) {
    gymContainer.innerHTML = '';
    for (let i = 0; i < limit && i < responseData.length; i++) {
      const gymImgSrc = responseData[i].gymImgs[0].img;
      let gymId = responseData[i].id;
      let gymname = responseData[i].name;
      let gymaddress = responseData[i].address;
      let temp = `
            <div class="gym-approve-wait" onclick="location.href='/gym/gymDetail?gym=${gymId}'">
              <img class="gym-list-img" src="${gymImgSrc}"  alt="" />
              <ul class="gym-info-box">
                <li class="gym-name">${gymname}</li>
                <li class="gym-location">${gymaddress}</li>
                <li class="gym-review-${gymId}"></li>
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
            <div class="gym-star">⭐<span>${res.data.avgStar}</span>(${reivewsLength})</div>
            `;
      $(`.gym-review-${gymId}`).append(avgStar);
    }
    postCount += limit;
  } else {
    const remainingGyms = responseData.slice(postCount);
    const maxGymsToLoad = Math.min(limit, remainingGyms.length);
    for (let i = 0; i < maxGymsToLoad; i++) {
      let id = remainingGyms[i].id;
      let gymImgSrc2 = remainingGyms[i].gymImgs[0].img;
      let name = remainingGyms[i].name;
      let address = remainingGyms[i].address;
      let temp2 = `
      <div class="gym-approve-wait" onclick="location.href='/gym/gymDetail?gym=${id}'">
        <img class="gym-list-img" src="${gymImgSrc2}"  alt="" />
        <ul class="gym-info-box">
          <li class="gym-name">${name}</li>
          <li class="gym-location">${address}</li>
          <li class="gym-review-${id}"></li>
        </ul>
      </div>
      `;
      $('.approve-wait').append(temp2);
      const res = await axios({
        method: 'get',
        url: `/api/gym/${id}/review`,
      });
      const reivewsLength = res.data.reviews.length;
      let avgStar2 = `
            <div class="gym-star">⭐<span>${res.data.avgStar}</span>(${reivewsLength})</div>
            `;
      $(`.gym-review-${id}`).append(avgStar2);
    }
    postCount += maxGymsToLoad;
  }
  loading = false;
}
getGymList();

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && postCount > 0 && postCount < data.length) {
    getGymList();
  }
});
