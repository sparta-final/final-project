$(document).ready(function () {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  verifyUser(year, month);
});

function verifyUser(year, month) {
  const thisYear = new Date().getFullYear();
  const Today = new Date().getDate();
  axios
    .get(`/api/qrcode/userecord/${year}/${month}`)
    .then((res) => {
      data = res.data;
      const gymList = [];
      for (let j = 0; j < data.length; j++) {
        gymList.push(data[j].gymId);
      }
      const eachGym = [...new Set(gymList)];
      for (let i = 0; i < data.length; i++) {
        if (Today === data[i].createdAt.split('-')[2].split('T')[0]) {
          alert('하루 1번만 이용 가능합니다.');
        }
        if (data[i].user.membership === 'Basic') {
          if (eachGym.length > 3) {
            alert('이번달 타 가맹점 이용횟수가 초과되었습니다.');
          }
        }
        if (data[i].user.membership === 'Standard') {
        }
        if (data[i].user.membership === 'Premium') {
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
