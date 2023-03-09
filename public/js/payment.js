const IMP = window.IMP;
IMP.init('imp52616317');

const body = document.querySelector('body');
body.addEventListener('click', function (e) {
  if (e.target.id !== 'subscribe-btn') return;
  const membership = e.target.parentElement.firstElementChild.textContent;
  const amount = Number(e.target.parentElement.children[1].textContent);
  console.log('✨✨✨', membership, amount, '✨✨✨');
  requestPay(membership, amount);
});
// pg결제창 이용 빌링키 발급 요청
function requestPay(membership, amount) {
  const now = Math.floor(new Date().getTime());
  // ✨✨✨ 빌링 키 요청 ✨✨✨
  IMP.request_pay(
    {
      pg: 'kakaopay',
      pay_method: 'card',
      merchant_uid: `${membership}_id_${now}`, // 빌링키 방급용 고유 주문번호
      customer_uid: 'sixpack_id_1235', // 카드(빌링키)와 1:1로 대응하는 값
      name: membership,
      amount: amount,
      buyer_email: 'sixpack@gmail.com',
      buyer_name: '홍길동',
      buyer_tel: '010-1234-5678',
      buyer_addr: '서울특별시 강남구 신사동',
      buyer_postcode: '01181',
    },
    async function (rsp) {
      console.log('✨✨✨', 'rsp: ', rsp, '✨✨✨');
      if (rsp.success) {
        // 빌링키 발급 성공
        // complete 에서 결제완료 알림
        axios({
          url: 'https://063b-61-78-119-93.jp.ngrok.io/api/payment/complete',
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          data: {
            merchant_uid: rsp.merchant_uid,
          },
        }).then((data) => {
          // 서버 결제 API 성공시 로직
          console.log('✨✨✨', data, '✨✨✨');
          // alert(`${name} 멤버십 구독 신청이 완료되었습니다.`);
          window.location.replace(`/complete`);
        });
      } else {
        // 빌링키 발급 실패
        alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
      }
    }
  );
}
