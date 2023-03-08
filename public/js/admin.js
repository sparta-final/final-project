$(document).ready(function () {
  const now = new Date();
  console.log('✨✨✨', now, '✨✨✨');
  let year = now.getFullYear();
  let month = now.getMonth(); // 기본으로 이전 달 데이터 가져오기
  getMembers();
  getGym();
  getRank(year, month);
  salesMonth(year, month);
});

function getMembers() {
  axios({
    method: 'get',
    url: 'api/admin/member',
  })
    .then((response) => {
      const data = response.data;
      let memberAll = data.reduce(function add(sum, cur) {
        return sum + cur;
      });

      let temp = `
        <p class="admin-membership">구독 회원 <span>${memberAll}</span></p>
        <ul class="">
          <li class="admin-basic">Basic <span></span>${data[0]}</li>
          <li class="admin-standard">Standard <span></span>${data[1]}</li>
          <li class="admin-premium">Premium <span></span>${data[2]}</li>
        </ul>`;
      $('.admin-members').append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getGym() {
  axios({
    method: 'get',
    url: 'api/admin/gym',
  })
    .then((response) => {
      const data = response.data;
      let gymAll = data.reduce(function add(sum, cur) {
        return sum + cur;
      });

      let temp = `
        <p class="admin-gym-all">제휴 업체 <span>${gymAll}</span></p>
        <ul class="">
          <li class="admin-gym">헬스장 <span>${data[0]}</span></li>
          <li class="admin-crossfit">크로스핏 <span>${data[1]}</span></li>
          <li class="admin-filates">필라테스 <span>${data[2]}</span></li>
        </ul>`;
      $('.admin-gym').append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getRank(year, month) {
  console.log('✨✨✨', year, month, '✨✨✨');
  axios({
    method: 'get',
    url: `api/admin/rank/a/${year}/${month}`,
  })
    .then((response) => {
      const data = response.data;
      console.log('✨✨✨', 'response', data[0], '✨✨✨');

      for (let i in data) {
        let temp = `
          <li>${Number(i) + 1}위 Data</li>
          <li>${data[i].gymId}</li>
          <li>${data[i].paid}</li>
          <li>${data[i].count}</li>
          <li>${data[i].rating}</li>
          `;
        $('.admin-rank').append(temp);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function salesMonth(year, month) {
  console.log('✨✨✨', year, month, '✨✨✨');
  axios({
    method: 'get',
    url: `api/admin/sales/${year}/${month}`,
  })
    .then((response) => {
      const data = response.data;
      console.log('✨✨✨', 'response', data, '✨✨✨');

      let temp = `
          <p>${data}</p>
          `;
      $('.sales-month').append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}
