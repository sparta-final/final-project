$(document).ready(function () {
  user();
});

function user() {
  axios
    .get(`api/business`, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    })
    .then((res) => {
      console.log('res!!!: ', res);
      $('#name').text(res.data.name);
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
