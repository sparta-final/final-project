const userType = localStorage.getItem('type');
if (userType !== 'user') {
  alert('일반 로그인이 필요한 서비스입니다.');
  window.location.href = '/user/login';
}

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

      if (window.location.href.includes('paymentDetails')) {
        getPaymentData(res.data);
      } else {
        getPaidData(res.data);
      }
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
      console.log('✨✨✨', 'data', data.membership, '✨✨✨');
      console.log('✨✨✨', 'response', response, '✨✨✨');
      let custimerUid = response[0].customerUid;
      let createAt = response[0].createdAt.substring(0, 7);
      let cardName = response[0].card_name;
      let cardNum = response[0].card_number;
      let cardNumber = cardNum.slice(0, 4) + '-' + cardNum.slice(4, 8);
      console.log('✨✨✨', 'cardNumber', cardNumber, '✨✨✨');
      let email = data.email;
      let phone = data.phone;
      let temp = ``;
      if (data.membership !== null) {
        temp = `
      <p class="member-start">멤버십 시작일 : ${createAt}</p>
      <div class="membership-data-wrap">
        멤버십 & 결제 정보
        <span>
          <p class="member-email">${email}</p>
          <p class="member-phone">전화번호 : ${phone}</p>
        </span>
        <span>
          <p class="member-card">${cardName} ${cardNumber}** **** ****</p>
          <p class="member-next-paid">다음 결제일은 ${nextPay} 입니다</p>
        </span>
        <div class="member-paid-list" onclick="location.href='mypage/paymentDetails'" >결제 내역 <img src="/images/right-arrow.png" alt="" class="member-info-btn"  /></div>
        <div class="use-gym-list" onclick="location.href='mypage/history'">헬스장 이용 내역 <img src="/images/right-arrow.png" alt="" class="member-info-btn" /></div>
        <div class="my-review" onclick="location.href='/mypage/review'" >리뷰 관리 <img src="/images/right-arrow.png" alt="" class="member-info-btn" /></div>
        <button class="member-close" onclick="cancelPay('${custimerUid}')">멤버십 해지</button>
      </div>
      `;
      } else {
        temp = `
        <p class="member-start">멤버십 이용중이 아닙니다.</p>
        <div class="no-membership-wrap">
        <div class="member-paid-list" onclick="location.href='mypage/paymentDetails'" >결제 내역 <img src="/images/right-arrow.png" alt="" class="member-info-btn"  /></div>
        <div class="use-gym-list" onclick="location.href='mypage/history'">헬스장 이용 내역 <img src="/images/right-arrow.png" alt="" class="member-info-btn" /></div>
        <div class="my-review" onclick="location.href='/mypage/review'" >리뷰 관리 <img src="/images/right-arrow.png" alt="" class="member-info-btn" /></div>
        </div>
        `;
      }
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

function getPaymentData(data) {
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
      console.log(y, m);
      var nextPay = new Date(y, m, 1).toLocaleString().substring(0, 10);
      const response = res.data;
      let custimerUid = response[0].customerUid;
      let createAt = response[0].createdAt.substring(0, 7);
      let createAtDay = response[0].createdAt.substring(0, 10);
      let cardName = response[0].card_name;
      let cardNumber = response[0].card_number;
      let membership = response[0].merchantUid.split('_')[0];
      let amount = response[0].amount.toLocaleString();

      let length = response.length;

      console.log('length : ', length);

      let temp = `
      <p class="my-member">내 멤버십</p>
      <div class="membership-data-wrap">
        멤버십
        <span class='member'>
          <p class="member-level">${membership}</p>
          <p class="member-amount">월 ${amount}원</p>
          <br>
          <p>다음 결제 날짜</p>
          <p class="member-next-paid">${nextPay}</p>
        </span>        
      </div>
      `;

      for (let i = 0; i < length; i++) {
        let createAtDay = response[i].createdAt.substring(0, 10);
        let y = createAtDay.substring(0, 4);
        let m = createAtDay.substring(5, 7);
        let d = getLastDayOfMonth(y, m);
        let existDay = y + '-' + m + '-' + d;
        let cardName = response[i].card_name;
        let cardNumber = response[i].card_number;
        let membership = response[i].merchantUid.split('_')[0];
        let amount = response[i].amount.toLocaleString();
        let temp2 = `
        <div class="membership-data-past-wrap">
          <span class='member'>
          <p class="member-createAt">${createAtDay}</p>
          <p class="member-level">${membership}</p>
          <p class="member-exist">${createAtDay} ~ ${existDay}</p>          
          <p class="member-card">${cardName} ${cardNumber} ** **** ****</p>
          <p class="member-amount">월 ${amount}원</p>
          </span>
        </div>`;

        $('.membership-past-wrap').append(temp2);
      }

      $('.membership-wrap').append(temp);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 해당 월의 마지막 날짜 구하기
function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
