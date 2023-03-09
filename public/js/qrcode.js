
$(document).ready(function () {
  getQRCode();
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
          Authorization: `Bearer ${localStorage.getItem('at')}`,
        },
      }
    )
    .then((res) => {
      document.getElementById('qr').innerHTML = `<img class="qr-img" src="${res.data}" />`;
    })
    .catch((err) => {
      console.log(err);
    });
}