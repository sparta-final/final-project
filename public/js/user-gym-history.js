const userType = localStorage.getItem('type');
if (userType !== 'user') {
  alert('일반 로그인이 필요한 서비스입니다.');
  window.location.href = '/user/login';
}

$(document).ready(function () {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  getUseGymHistory(year, month);
});
/**
 * @description: 일반회원 년,월별 usergym 이용내역 불러오기
 * @argument: year, month
 * @author: 김승일
 */
const getUseGymHistory = async (year, month) => {
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  if (prevYear > new Date().getFullYear() || (prevYear === new Date().getFullYear() && prevMonth > new Date().getMonth())) {
    alert('다음달 데이터는 가져올 수 없습니다.');
    location.reload();
    return;
  }

  const res = await axios.get(`/api/user/visit/${year}/${month}`, {
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  });
  const histories = res.data;
  $('.text-gray-dark').empty();

  for (let i in histories) {
    console.log('histories[i]', histories[i]);
    // 리뷰가 존재한다면 리뷰보기 버튼, 없다면 리뷰작성 버튼
    if (histories[i].reviewId) {
      histories[
        i
      ].reviews = `<button class="review-btn" onclick="location.href='/review/review-detail?reviewId=${histories[i].reviewId}'">리뷰보기</button>`;
    } else {
      histories[
        i
      ].reviews = `<button class="review-btn" onclick="location.href='/review/postReview?gymId=${histories[i].gymId}'">리뷰작성</button>`;
    }

    let temp = `
      <tr class='ta-center'>
        <td>${histories[i].gym.name}</td>
        <td>${histories[i].createdAt.substring(0, 10)}</td>
        <td>${histories[i].reviews}</td>
      </tr>
    `;
    $('.text-gray-dark').append(temp);
  }

  const curMonth = $('.cur-month');
  const calculateMonth = $('.admin-month-title');
  if (curMonth) {
    curMonth.remove();
    calculateMonth.remove();
  }

  let now = `
      <li class="cur-month">${year}.${month}</li>`;
  $('.prev-month').after(now);
  $('#prevMonthBtn').off('click');
  $('#prevMonthBtn').on('click', function () {
    getUseGymHistory(prevYear, prevMonth);
  });
  $('#nextMonthBtn').off('click');
  $('#nextMonthBtn').on('click', function () {
    getUseGymHistory(nextYear, nextMonth);
  });
};
