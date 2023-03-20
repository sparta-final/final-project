$(document).ready(function () {
  user();
});

/**
 * 사업자 마이페이지
 * @author 주현진
 */

function user() {
  axios
    .get(`/api/business`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      $('#business-name').text(res.data.name);
      $('#email').text(res.data.email);
      $('#profileImage').attr(
        'src',
        res.data.profileImage ? res.data.profileImage : 'https://www.sixpack.pro/images/default_profile.png'
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

function logout() {
  axios({
    url: '/api/auth/logout',
    method: 'post',
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  })
    .then((res) => {
      localStorage.removeItem('at');
      localStorage.removeItem('rt');
      localStorage.removeItem('type');
      location.href = '/';
    })
    .catch((err) => {
      console.log(err);
    });
}
