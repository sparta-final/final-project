$(document).ready(function () {
  const userType = localStorage.getItem('type');
  if (userType === 'user') {
    getQRCode();
  }
});
/**
 * @description: QR코드 생성
 * @author: 김승일
 */
function getQRCode() {
  axios
    .post(
      '/api/qrcode',
      {},
      {
        headers: {
          accesstoken: `${localStorage.getItem('at')}`,
          refreshtoken: `${localStorage.getItem('rt')}`,
        },
      }
    )
    .then((res) => {
      document.getElementById('qr').innerHTML = `<img class="qr-img" src="${res.data}" />`;
    })
    .catch((err) => {
      if (err.response.status === 403) {
        alert('로그인이 필요합니다.');
        location.href = '/';
        console.log(err);
      }
    });
}
