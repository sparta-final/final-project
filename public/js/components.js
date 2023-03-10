$(document).ready(function () {
  let url = window.location.pathname.split('/')[1];
  // console.log('✨✨✨', url, '✨✨✨');

  footerSelect(url);
});

function footerSelect(url) {
  let svg = document.querySelectorAll('#Layer_1');
  if (url === '' || url === 'admin') {
    svg[0].classList.add('svg-select');
  }
  if (url === 'gym') {
    svg[1].classList.add('svg-select');
  }
  if (url === 'feed') {
    svg[2].classList.add('svg-select');
  }
  if (url === 'user' || url === 'business') {
    svg[3].classList.add('svg-select');
  }
}
