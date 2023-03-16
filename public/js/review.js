const userType = localStorage.getItem('type');
if (userType !== 'user') {
  alert('일반 로그인이 필요한 서비스입니다.');
  window.location.href = '/user/login';
}

$(document).ready(function () {
  getMyReview();
});

/**
 * @description: 리뷰조회(회원별)
 * @author: 김승일
 */
async function getMyReview() {
  const res = await axios.get('/api/review', {
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  });
  const reviews = res.data;
  console.log('✨✨✨', reviews, '✨✨✨');
  function getStarString(reviewStarRating) {
    const starMap = {
      1: '⭐',
      1.5: '⭐',
      2: '⭐⭐',
      2.5: '⭐⭐',
      3: '⭐⭐⭐',
      3.5: '⭐⭐⭐',
      4: '⭐⭐⭐⭐',
      4.5: '⭐⭐⭐⭐',
      5: '⭐⭐⭐⭐⭐',
    };
    return starMap[reviewStarRating] || '';
  }

  for (const review of reviews) {
    if (review.reviews.length === 0) continue;
    let gymName = review.gym.name;
    let reviewStar = review.reviews[0].star;
    let starString = getStarString(reviewStar);
    let reviewCreatedAt = review.createdAt.toString().substring(0, 10);
    let reviewImg = review.reviews[0].reviewImg;
    let reviewContent = review.reviews[0].review;

    let temp = `
    <div class="review-card">
      <div class="review-header">
        <span class="user-name">${gymName}</span>
        </div>
        <div class="review-star-date-wrap">
        <span class="reviews-star">${starString}</span><br>
        <span class="reviews-date">${reviewCreatedAt}</span>
        <button class="review-delete-btn" onclick="deleteReview(${review.reviewId})">삭제</button>
      </div>
      <div class="review-content">
        <textarea class="review-text" cols="30" disabled>${reviewContent}</textarea>
      </div>
    </div>
    `;
    $('.review-wrap').append(temp);
    // if (reviewImg) {
    // index 값 필요
    //   $('.review-content').eq(i).append(`<img class="review-img-all" src="${reviewImg}" alt="" />`);
    // }
  }
  const reviewTextareas = document.querySelectorAll(`textarea.review-text`);
  for (let i = 0; i < reviewTextareas.length; i++) {
    const targetTextarea = reviewTextareas[i];
    const textLength = targetTextarea.value.length;
    targetTextarea.style.height = (textLength / 35) * 24 + 'px';
  }
}

/**
 * @description: 리뷰삭제
 * @param {number} reviewId
 * @author: 김승일
 */
async function deleteReview(reviewId) {
  const res = await axios.delete(`/api/review/${reviewId}`, {
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  });
  if (res.status === 200) {
    alert('리뷰가 삭제되었습니다.');
    location.reload();
  } else {
    alert('리뷰 삭제에 실패했습니다.');
  }
}
