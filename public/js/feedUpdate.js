$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = +urlParams.get('id');
  feedUpdateGet(id);
  // const targetTextarea = document.querySelector(`#update-content`);
  // // const rowCount = targetTextarea.value.split(/\r\n|\r|\n/).length;
  // targetTextarea.style.height = rowCount * 24 + 'px'; //줄 수에 따라서 높이를 조절
});

function feedUpdateGet(id) {
  axios
    .get(`/api/feed/${id}`, {
      params: {
        id: id,
      },
    })
    .then((response) => {
      const data = response.data;
      let content = data.content;
      let img = data.feedsImgs[0].image;
      let temp = `
      <img src="${img}" alt="" class="feed-image" />
      <textarea name="description" id="update-content" autofocus>${content}</textarea>
      `;
      $('.update-feed-wrap').append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}
function feedUpdate() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = +urlParams.get('id');
  const content = document.getElementById('update-content').value;
  axios
    .put(
      `/api/feed/${id}`,
      { content: content },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          accesstoken: `${localStorage.getItem('at')}`,
          refreshtoken: `${localStorage.getItem('rt')}`,
        },
      }
    )
    .then((response) => {
      alert('수정.');
      window.location.replace(`/feed`);
    })
    .catch((err) => {
      console.log(err);
    });
}
