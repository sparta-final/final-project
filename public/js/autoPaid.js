async function autoPaid() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  await axios({
    method: 'get',
    url: `/api/admin/calculateGym/${year}/${month}`,
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  })
    .then((response) => {
      const data = response.data;
      for (let i in data) {
        await axios({
          url: `/api/admin/calculate/${data[i].gym_id}/${year}/${month}`,
          method: 'post',
          headers: {
            accesstoken: `${localStorage.getItem('at')}`,
            refreshtoken: `${localStorage.getItem('rt')}`,
          },
        })
          .then((res) => {
            console.log('✨✨✨', 'success ', data[i].gym_id, '✨✨✨');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
