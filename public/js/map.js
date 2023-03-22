let mapContainer = document.getElementById('map'); // 지도를 표시할 div
let mapOption = {
  center: new kakao.maps.LatLng(37.57194, 126.97698), // 지도의 중심좌표
  level: 2, // 지도의 확대 레벨
  mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
};
// 지도를 생성한다
let map = new kakao.maps.Map(mapContainer, mapOption);

// 지도 타입 변경 컨트롤을 생성한다
let mapTypeControl = new kakao.maps.MapTypeControl();
// 지도의 상단 우측에 지도 타입 변경 컨트롤을 추가한다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
// 지도에 확대 축소 컨트롤을 생성한다
let zoomControl = new kakao.maps.ZoomControl();
// 지도의 우측에 확대 축소 컨트롤을 추가한다
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
