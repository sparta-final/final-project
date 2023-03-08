function userlogin() {
  axios
    .post('/api/auth/user/login', {
      email: document.getElementById('loginId').value,
      password: document.getElementById('loginPw').value,
    })
    .then((res) => {
      console.log(res);
      localStorage.setItem('token', res.data.at);
    })
    .catch((err) => {
      console.log(err);
    });
}

function enrollFeed() {
  const content = document.getElementById('content').value;
  const feedImg = document.getElementById('feedImg');

  const formData = new FormData();
  formData.append('content', content);
  formData.append('feedImg', feedImg.files[0]);

  axios
    .post('/api/feed', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log('이미지', feedImg.files[0]);
      console.log(err);
    });
}
