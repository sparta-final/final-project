
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

  function getStarString(reviewStarRating) {
    const starMap = {
      1: '⭐',
      2: '⭐⭐',
      3: '⭐⭐⭐',
      4: '⭐⭐⭐⭐',
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
    let reviewImgSrc = '';
    if (reviewImg === null || reviewImg === '') {
      reviewImgSrc = '/images/default_profile.png';
    } else {
      reviewImgSrc = reviewImg;
    }
    let reviewContent = review.reviews[0].review;
    let temp = `
    <div class="review-card">
      <div class="review-header">
        <span class="user-name">${gymName}</span>
        </div>
        <div class="review-star-date-wrap">
        <span class="reviews-star">${starString}</span><br>
        <span class="reviews-date">${reviewCreatedAt}</span>
        <button class="review-delete-btn" onclick="deleteReview(${review.id})">삭제</button>
      </div>
      <div class="review-content">
        <img class="review-img" src="${reviewImgSrc}" alt="" />
        <textarea class="review-text" cols="30" disabled>${reviewContent}</textarea>
      </div>
    </div>
    `;
    $('.review-wrap').append(temp);
  }
  const reviewTextareas = document.querySelectorAll(`textarea.review-text`);
  for (let i = 0; i < reviewTextareas.length; i++) {
    const targetTextarea = reviewTextareas[i];
    const textLength = targetTextarea.value.length;
    targetTextarea.style.height = textLength / 35 * 24 + 'px';
  }
}