$(document).ready(function () {
  user();
});

function user() {
  axios
    .get(`/api/business`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      $('#name').text(res.data.name);
      $('#email').text(res.data.email);
      $('#profileImage').attr('src', res.data.profileImage ? res.data.profileImage : '/images/default_profile.png');
    })
    .catch((err) => {
      console.log(err);
    });
}

function logout() {
  localStorage.removeItem('at');
  localStorage.removeItem('rt');
  localStorage.removeItem('type');
  location.href = '/';
}
