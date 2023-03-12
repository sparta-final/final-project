$(document).ready(function () {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  getThisGym(id);
  getVisitUser(id, year, month);
});

// 헬스장 정보 가져오기
function getThisGym(id) {
  axios
    .get(`/api/gym/${id}`, {
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
      const curMonth = $('.cur-month');
      if (curMonth) {
        curMonth.remove();
      }

      let now = `
      <li class="cur-month">${year}.${month}</li>`;
      $('.prev-month').after(now);

      $('#prevMonthBtn').off('click');
      $('#prevMonthBtn').on('click', function () {
        getVisitUser(id, prevYear, prevMonth);
      });
      $('#nextMonthBtn').off('click');
      $('#nextMonthBtn').on('click', function () {
        getVisitUser(id, nextYear, nextMonth);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// 전 월  버튼 클릭
$('#prevMonthBtn').on('click', function () {
  getVisitUser(id, year, month);
});

// 다음달 버튼 클릭
$('#nextMonthBtn').on('click', function () {
  getVisitUser(id, year, month);
});
