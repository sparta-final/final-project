$(document).ready(function () {
  const userType = localStorage.getItem('type');
  footerSelect();
  const qrCode = document.querySelector('.qr-code');
  const qrCamera = document.querySelector('#camera-wrap');
  if (userType === null || userType === 'admin') {
    qrCode.style.display = 'none';
    qrCamera.style.display = 'none';
    qrCode.parentElement.style.width = '44px';
  }
  if (userType === 'user') {
    qrCode.style.display = 'block';
    qrCamera.style.display = 'none';
    qrCode.parentElement.style.width = '88px';
  }
  if (userType === 'business') {
    qrCamera.style.display = 'block';
    qrCode.style.display = 'none';
    qrCode.parentElement.style.width = '88px';
  }
});

function footerInfo() {
  const userType = localStorage.getItem('type');
  if (!userType) {
    window.location.href = '/user/login';
  }
  if (userType === 'user') {
    window.location.href = '/mypage';
  }
  if (userType === 'admin') {
    window.location.href = '/admin';
  }
  if (userType === 'business') {
    window.location.href = '/business/businessMyInfo';
  }
}

function footerSelect() {
  let url = window.location.pathname.split('/')[1];
  let svg = document.querySelectorAll('#Layer_1');
  if (url === '') {
    svg[0].classList.add('svg-select');
  }
  if (url === 'gym') {
    svg[1].classList.add('svg-select');
  }
  if (url === 'feed') {
    svg[2].classList.add('svg-select');
  }
  if (url === 'user' || url === 'business' || url === 'mypage' || url === 'admin' || url === 'review') {
    svg[3].classList.add('svg-select');
  }
}
