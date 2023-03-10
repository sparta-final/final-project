$(document).ready(function () {
  user();
});

function user() {
  axios
    .get(`/api/user`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      $('#nickname').text(res.data.nickname);
      $('#email').text(res.data.email);
      $('#profileImage').attr('src', res.data.profileImage ? res.data.profileImage : '/images/default_profile.png');
    })
    .catch((err) => {
      console.log(err);
    });
}

function logout() {
  localStorage.removeItem('token');
  location.href = '/';
}
