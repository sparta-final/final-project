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
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
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
