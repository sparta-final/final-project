const userType = localStorage.getItem('type');
if (userType !== 'user') {
  alert('일반 로그인이 필요한 서비스입니다.');
  window.location.href = '/user/login';
}

// 별점 가져오기
let star_rating;
$('input[name=star_rating]').click(function () {
  let click_star_rating = $(this).attr('value');
  star_rating = Number(click_star_rating);
});

// 사진 미리보기
const fileInput = document.getElementById('reviewImg');
const preview = document.getElementById('thumbnail');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// textarea 자동 줄바꿈
const textarea = document.getElementsByClassName('review-textarea')[0];
textarea.addEventListener('input', (e) => {
  const target = e.target;
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
});

/**
 * @description: 리뷰 작성
 * @author: 김승일
 */
async function postReview(usergymId) {
  const reviewImg = document.getElementById('reviewImg').files[0];
  if (!reviewImg) {
    toastr.error('사진을 첨부해주세요.', '오류', { timeOut: 1500, positionClass: "toast-top-center", closeButton: true, progressBar: true, preventDuplicates: true });
    return;
  }
  const reviewTextarea = document.getElementsByClassName('review-textarea')[0].value;
  if (!reviewTextarea) {
    toastr.error('리뷰를 작성해주세요.', '오류', { timeOut: 1500, positionClass: "toast-top-center", closeButton: true, progressBar: true, preventDuplicates: true });
    return;
  }
  const starRating = star_rating;
  if (!starRating) {
    toastr.error('별점을 선택해주세요.', '오류', { timeOut: 1500, positionClass: "toast-top-center", closeButton: true, progressBar: true, preventDuplicates: true });
    return;
  }
  const formData = new FormData();
  formData.append('reviewImg', reviewImg);
  formData.append('review', reviewTextarea);
  formData.append('star', starRating);
  await axios
    .post(`/api/gym/${usergymId}/review`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      if (res.status === 201) {
        toastr.success('리뷰가 작성되었습니다.', '성공', { timeOut: 1500, positionClass: "toast-top-center", closeButton: true, progressBar: true, preventDuplicates: true });
        setTimeout(() => {
          window.location.replace('/mypage/history');
        }, 1500);
      } else {
        toastr.error('리뷰 작성에 실패했습니다.', '오류', { timeOut: 1500, positionClass: "toast-top-center", closeButton: true, progressBar: true, preventDuplicates: true });
      }
    })
    .catch((err) => {
      console.log('err', err);
      toastr.error('리뷰 작성에 실패했습니다.', '오류', { timeOut: 1500, positionClass: "toast-top-center", closeButton: true, progressBar: true, preventDuplicates: true });
    });
}
