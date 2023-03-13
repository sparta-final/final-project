const IMP = window.IMP;
IMP.init('imp52616317');

const body = document.querySelector('body');
body.addEventListener('click', function (e) {
  if (e.target.id !== 'subscribe-btn') return;
  console.log('✨✨✨', localStorage.getItem('type'), '✨✨✨');
  if (localStorage.getItem('type') === 'user') {
    const membership = e.target.parentElement.firstElementChild.textContent;
    const amountText = e.target.parentElement.children[1].textContent;
    const amount = Number(amountText.replace(',', '').substring(0, 6));
    requestPay(membership, amount);
  } else {
    alert('일반유저로 로그인 후 진행해 주세요.');
  }
});
// pg결제창 이용 빌링키 발급 요청
async function requestPay(membership, amount) {
  const response = await axios({
    method: 'get',
    url: `/api/user`,
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  });
  const now = Math.floor(new Date().getTime());
  console.log('✨✨✨', response.data.email, '✨✨✨');
  const id = response.data.id;
  const email = response.data.email;
  const nickname = response.data.nickname;
  const phone = response.data.phone;
  // ✨✨✨ 빌링 키 요청 ✨✨✨
  IMP.request_pay(
    {
      pg: 'kakaopay',
      pay_method: 'card',
      merchant_uid: `${membership}_${email}_${now}`, // 빌링키 방급용 고유 주문번호
      customer_uid: `${id}_${email}`, // 카드(빌링키)와 1:1로 대응하는 값
      name: membership,
      amount: amount,
      buyer_email: email,
      buyer_name: nickname,
      buyer_tel: phone,
      buyer_addr: '회원가입시 주소 안받음',
      buyer_postcode: '12345',
    },
    async function (rsp) {
      console.log('✨✨✨', 'rsp: ', rsp, '✨✨✨');
      if (rsp.success) {
        // 빌링키 발급 성공
        // complete 에서 결제완료 알림
        axios({
          url: `/api/payment/complete`,
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          data: {
            merchant_uid: rsp.merchant_uid,
          },
        }).then((data) => {
          // 서버 결제 API 성공시 로직
          console.log('✨✨✨', data, '✨✨✨');
          // alert(`${name} 멤버십 구독 신청이 완료되었습니다.`);
          window.location.replace(`/payment`);
        });
      } else {
        // 빌링키 발급 실패
        alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
      }
    }
  );
}
