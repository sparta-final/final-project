const userType = localStorage.getItem('type');
if (userType !== 'admin') {
  alert('접근 권한이 필요합니다.');
  window.location.href = '/';
}

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth(); // 기본으로 이전 달 데이터 가져오기
$(document).ready(function () {
  let category = '정산 금액';
  getMembers();
  getGym();
  getRank(category, year, month);
  salesMonth(category, year, month);
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

function getRank(category, year, month) {
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
    url: `api/admin/rank/${category}/${year}/${month}`,
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  })
    .then((response) => {
      const data = response.data;
      $('.text-gray-dark').empty();
      $('.cur-month').remove();
      let rating;
      let gymName;
      let userCount;
      let calculatePaid;

      for (let i = 0; i < 10; i++) {
        if (category === '정산 금액') {
          gymName = data[i].gym_name;
          userCount = data[i].userCount;
          calculatePaid = data[i].calculate_paid;
          if (data[i].averageStar === null) {
            rating = '-';
          } else {
            rating = data[i].averageStar.toFixed(1);
          }
        }
        if (category === '이용자 수') {
          gymName = data.gymUserCounts[i].gym_name;
          calculatePaid = data.gymUserCounts[i].calculate_paid;
          userCount = data.counts[i];
          if (data.gymUserCounts[i].averageStar === null) {
            rating = '-';
          } else {
            rating = data.gymUserCounts[i].averageStar.toFixed(1);
          }
        }
        if (category === '평점') {
          gymName = data.gymStarAverages[i].gymName;
          calculatePaid = data.gymStarAverages[i].paid;
          userCount = data.ratingUserCount[i][0].count;
          if (data.gymStarAverages[i].average === null) {
            rating = '-';
          } else {
            rating = data.gymStarAverages[i].average.toFixed(1);
          }
        }
        let temp = `
          <tr class='ta-center'>
            <td>${Number(i) + 1}</td>
            <td>${gymName}</td>
            <td class='fs-14'>${userCount.toLocaleString()}</td>
            <td>${calculatePaid.toLocaleString()}</td>
            <td>${rating}</td>
          </tr>
            `;
        $('.text-gray-dark').append(temp);
      }

      function removeAll() {
        const curMonth = $('.cur-month');
        const calculateMonth = $('.admin-month-title');
        if (curMonth.length > 0) {
          curMonth.remove();
          calculateMonth.remove();
        }
      }
      // $('th.cursor').click((e) => {
      //   $('.cur-month').remove();
      // });

      let now = `
      <li class="cur-month">${year}.${month}</li>`;
      $('.prev-month').after(now);

      $('#prevMonthBtn').off('click');
      $('#prevMonthBtn').on('click', function () {
        removeAll();
        getRank(category, prevYear, prevMonth);
        salesMonth(category, prevYear, prevMonth);
      });
      $('#nextMonthBtn').off('click');
      $('#nextMonthBtn').on('click', function () {
        removeAll();
        getRank(category, nextYear, nextMonth);
        salesMonth(category, nextYear, nextMonth);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function salesMonth(category, year, month) {
  axios({
    method: 'get',
    url: `api/admin/sales/${year}/${month}`,
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  })
    .then((response) => {
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

$('th.cursor').click((e) => {
  let eCategory = e.target.innerHTML;
  curDate = $('.cur-month')[0].innerHTML;
  cYear = Number(curDate.split('.')[0]);
  cMonth = Number(curDate.split('.')[1]);
  getRank(eCategory, cYear, cMonth);
});
