const userType = localStorage.getItem('type');
if (userType !== 'business') {
  alert('사업자 로그인이 필요한 서비스입니다.');
  window.location.href = '/business/login';
}

$(document).ready(function () {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  getThisGym(id);
  getVisitUser(id, year, month);
  caculateGym(id, year, month);
});

// 헬스장 정보 가져오기
function getThisGym(id) {
  axios
    .get(`/api/gym/list/${id}`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      const data = res.data;
      const name = data.name;

      const temp_html = `
      <td colspan="5" class="admin-gym-rank">${name}</td>
      `;
      $('#thisGymName').append(temp_html);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 헬스장 별 사용자 조회
function getVisitUser(id, year, month) {
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  if (prevYear > new Date().getFullYear() || (prevYear === new Date().getFullYear() && prevMonth > new Date().getMonth())) {
    alert('이번달 이후 조회는 불가능 합니다.');
    location.reload();
    return;
  }

  axios
    .get(`/api/admin/visituser/${id}/${year}/${month}`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      const data = res.data;
      $('.text-gray-dark').empty();

      for (let i in data) {
        let temp = `
          <tr class='ta-center'>
            <td>${Number(i) + 1}</td>
            <td>${data[i].user.nickname}</td>
            <td class='fs-14'>${data[i].createdAt.split('T')[0]}</td>
          </tr>
            `;
        $('.text-gray-dark').append(temp);
      }
      function removeAll() {
        const curMonth = $('.cur-month');
        const calculateMonth = $('.admin-month-title');
        if (curMonth) {
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
        getVisitUser(id, prevYear, prevMonth);
        caculateGym(id, prevYear, prevMonth);
      });
      $('#nextMonthBtn').off('click');
      $('#nextMonthBtn').on('click', function () {
        removeAll();
        getVisitUser(id, nextYear, nextMonth);
        caculateGym(id, nextYear, nextMonth);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// 정산 예정 금액
function caculateGym(id, year, month) {
  axios
    .get(`/api/admin/calculate/${id}/${year}/${month}`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      const data = res.data;

      if (data.length === 0) {
        alert('데이터가 없습니다');
        location.href = '/business/businessMyinfo';
      }
      const paid = data[0].paid.toLocaleString();

      let temp = `
        <p class='admin-month-title'>${month}월 매출 <span>${paid}</span> 원</p>
            `;
      $('.sales-month').append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}
