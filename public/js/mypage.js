$(document).ready(function () {
  user();
});

function user() {
  axios
    .get(`/api/user`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      // console.log('✨✨✨', res.data, '✨✨✨');
      $('#nickname').text(res.data.nickname);
      $('#email').text(res.data.email);
      $('#profileImage').attr('src', res.data.profileImage ? res.data.profileImage : '/images/default_profile.png');
      getMembership(res.data.id);
    })
    .catch((err) => {
      console.log(err);
    });
}

function logout() {
  localStorage.removeItem('token');
  location.href = '/';
}

function cancelPay() {
  try {
    axios({
      url: '/api/payment/unsubscribe',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        // 빌링키 생성시 customer_uid 가져오거나 저장해두는 로직 필요
        customer_uid: 'sixpack_id_1235',
      },
    }).then((data) => {
      // 서버 결제 API 성공시 로직
      alert(`구독이 해지되었습니다.`);
    });
  } catch (e) {
    alert(`에러 내용: ${e}`);
  }
}

function getMembership(id) {
  axios
    .get(`/api/user`, {
      // headers: {
      //   accesstoken: `${localStorage.getItem('at')}`,
      //   refreshtoken: `${localStorage.getItem('rt')}`,
      // },
    })
    .then((res) => {
      console.log('✨✨✨', res.data, '✨✨✨');

      // let temp = `
      // <p class="member-start">멤버십 시작일 :${createAt}</p>
      // <div class="membership-data-wrap">
      //   멤버십 & 결제 정보
      //   <span>
      //     <p class="member-email">${email}</p>
      //     <p class="member-phone">전화번호 : ${phone}</p>
      //   </span>
      //   <span>
      //     <p class="member-card">${cardName}카드 ${cardNum} **** **** ****</p>
      //     <p class="member-next-paid">다음 결제일은 ${date} 입니다</p>
      //   </span>
      //   <div class="member-paid-list">결제 내역 <img src="/images/right-arrow.png" alt="" class="member-info-btn" /></div>
      //   <div class="use-gym-list">헬스장 이용 내역 <img src="/images/right-arrow.png" alt="" class="member-info-btn" /></div>
      //   <div class="my-review">리뷰 관리 <img src="/images/right-arrow.png" alt="" class="member-info-btn" /></div>
      //   <button class="member-close" onclick="cancelPay()">멤버십 해지</button>
      // </div>
      // `
      // $('.membership-wrap').append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}
