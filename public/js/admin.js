const userType = localStorage.getItem('type');
if (userType !== 'admin') {
  alert('접근 권한이 필요합니다.');
  window.location.href = '/';
}

$(document).ready(function () {
  const now = new Date();
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
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  })
    .then((response) => {
      const data = response.data;
      let memberAll = data.reduce(function add(sum, cur) {
        return sum + cur;
      });

      let temp = `
        <p class='admin-membership'>구독 회원 <span>${memberAll.toLocaleString()}</span> 명</p>
        <ul class='admin-member-type'>
          <li class='admin-basic'>Basic <span>${data[0].toLocaleString()}</span> 명</li>
          <li class='admin-standard'>Standard <span>${data[1].toLocaleString()}</span> 명</li>
          <li class='admin-premium'>Premium <span>${data[2].toLocaleString()}</span> 명</li>
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
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  })
    .then((response) => {
      const data = response.data;
      let gymAll = data.reduce(function add(sum, cur) {
        return sum + cur;
      });

      let temp = `
        <p class='admin-gym-all'>제휴 가맹점 <span>${gymAll.toLocaleString()}</span> 개</p>
        <ul class='admin-gym-type'>
          <li class='admin-health'>헬스장 <span>${data[0].toLocaleString()}</span> 개</li>
          <li class='admin-crossfit'>크로스핏 <span>${data[1].toLocaleString()}</span> 개</li>
          <li class='admin-filates'>필라테스 <span>${data[2].toLocaleString()}</span> 개</li>
        </ul>`;
      $('.admin-gym').append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getRank(year, month) {
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  if (prevYear > new Date().getFullYear() || (prevYear === new Date().getFullYear() && prevMonth > new Date().getMonth())) {
    alert('이번달 이후 조회는 불가능 합니다.');
    location.reload();
    return;
  }
  axios({
    method: 'get',
    url: `api/admin/rank/a/${year}/${month}`,
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  })
    .then((response) => {
      const data = response.data;
      $('.text-gray-dark').empty();
      // 찾는 데이터가 0일때 부터는 다른조건을 안보기 떄문에 0인뒤로 순서가 엉킴.
      // const countRank = data.sort((a, b) => b.count - a.count);
      const paidRank = data.sort((a, b) => b.paid - a.paid);
      // console.log('✨✨✨', paidRank, '✨✨✨');
      // const ratingRank = data.sort((a, b) => b.rating - a.rating);
      // console.log('✨✨✨', ratingRank, '✨✨✨');
      for (let i in data) {
        if (data[i].count !== 0 || data[i].paid !== 0 || data[i].rating !== 0) {
          let temp = `
          <tr class='ta-center'>
            <td>${Number(i) + 1}</td>
            <td>${data[i].name}</td>
            <td class='fs-14'>${data[i].count.toLocaleString()}</td>
            <td>${data[i].paid.toLocaleString()}</td>
            <td>${data[i].rating}</td>
          </tr>
            `;
          $('.text-gray-dark').append(temp);
        }
      }
      function removeAll() {
        const curMonth = $('.cur-month');
        const calculateMonth = $('.admin-month-title');
        if (curMonth.length > 0) {
          curMonth.remove();
          calculateMonth.remove();
        }
      }

      let now = `
      <li class="cur-month">${year}.${month}</li>`;
      $('.prev-month').after(now);

      $('#prevMonthBtn').off('click');
      $('#prevMonthBtn').on('click', function () {
        removeAll();
        getRank(prevYear, prevMonth);
        salesMonth(prevYear, prevMonth);
      });
      $('#nextMonthBtn').off('click');
      $('#nextMonthBtn').on('click', function () {
        removeAll();
        getRank(nextYear, nextMonth);
        salesMonth(nextYear, nextMonth);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function salesMonth(year, month) {
  axios({
    method: 'get',
    url: `api/admin/sales/${year}/${month}`,
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  })
    .then((response) => {
      console.log('✨✨✨', response, '✨✨✨');
      const data = response.data.toLocaleString();

      if (data.length === 0) {
        alert('데이터가 없습니다');
      }

      let temp = `
      <p class='admin-month-title'>${month}월 매출 <span>${data}</span> 원</p>
          `;
      $('.sales-month').empty().append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}
