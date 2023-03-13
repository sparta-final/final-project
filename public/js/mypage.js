function user() {
  axios
    .get(`/api/user`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      $('#nickname').text(res.data.nickname);
      $('#email').text(res.data.email);
      $('#profileImage').attr('src', res.data.profileImage ? res.data.profileImage : '/images/default_profile.png');
      getPaidData(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function logout() {
  localStorage.removeItem('token');
  location.href = '/';
}

function getPaidData(data) {
  const id = data.id;
  axios
    .get(`/api/payment/${id}`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      var date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      var nextPay = new Date(y, m, 1).toLocaleString().substring(0, 10);
      const response = res.data;
      console.log('✨✨✨', 'data', data, '✨✨✨');
      console.log('✨✨✨', 'response', response, '✨✨✨');
      let custimerUid = response[0].customerUid;
      let createAt = response[0].createdAt.substring(0, 7);
      let cardName = response[0].card_name;
      let cardNumber = response[0].card_number;
      let email = data.email;
      let phone = data.phone;
      let temp = `
      <p class="member-start">멤버십 시작일 :${createAt}</p>
      <div class="membership-data-wrap">
        멤버십 & 결제 정보
        <span>
          <p class="member-email">${email}</p>
          <p class="member-phone">전화번호 : ${phone}</p>
        </span>
        <span>
          <p class="member-card">${cardName} ${cardNumber} ** **** ****</p>
          <p class="member-next-paid">다음 결제일은 ${nextPay} 입니다</p>
        </span>
        <div class="member-paid-list" >결제 내역 <img src="/images/right-arrow.png" alt="" class="member-info-btn" /></div>
        <div class="use-gym-list">헬스장 이용 내역 <img src="/images/right-arrow.png" alt="" class="member-info-btn" /></div>
        <div class="my-review">리뷰 관리 <img src="/images/right-arrow.png" alt="" class="member-info-btn" /></div>
        <button class="member-close" onclick="cancelPay('${custimerUid}')">멤버십 해지</button>
      </div>
      `;
      $('.membership-wrap').append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}

function cancelPay(custimerUid) {
  try {
    if (window.confirm('구독을 취소하시겠습니까?')) {
      axios({
        url: '/api/payment/unsubscribe',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          // 빌링키 생성시 customer_uid 가져오거나 저장해두는 로직 필요
          customer_uid: custimerUid,
        },
      }).then((data) => {
        // 서버 결제 API 성공시 로직
        alert(`구독이 해지되었습니다.`);
      });
    }
  } catch (e) {
    alert(`에러 내용: ${e}`);
  }
}
