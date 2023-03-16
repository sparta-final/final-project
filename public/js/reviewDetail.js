$(document).ready(function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const reviewId = urlParams.get('reviewId');
  getReviewDetail(reviewId);
});
/**
 * @description: 리뷰상세조회
 * @param {number} reviewId
 * @author: 김승일
 */
async function getReviewDetail(reviewId) {
  const res = await axios.get(`/api/review/${reviewId}`, {
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  });
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

  const review = res.data;
  let gymName = review.gym.name;
  let reviewStar = review.reviews[0].star;
  let starString = getStarString(reviewStar);
  let reviewCreatedAt = review.createdAt.toString().substring(0, 10);
  let reviewImg = review.reviews[0].reviewImg;
  let reviewContent = review.reviews[0].review;

  // let temp_img = `
  // <ul>
  //   <img src="${reviewImgSrc}" />
  // </ul>
  // `;
  // $('.review-image-wrap').append(temp_img);

  let temp = `
  <div class="review-card">
    <div class="review-header">
      <span class="user-name">${gymName}</span>
      </div>
      <div class="review-star-date-wrap">
      <span class="reviews-star">${starString}</span><br>
      <span class="reviews-date">${reviewCreatedAt}</span>
      <button class="review-delete-btn" onclick="deleteReview(${reviewId})">삭제</button>
    </div>
    <div class="review-content">
      <textarea class="review-text" cols="30" disabled>${reviewContent}</textarea>
    </div>
  </div>
  `;
  $('.review-wrap').append(temp);
  if (reviewImg) {
    $('.review-content').append(`<img class="review-img-all" src="${reviewImg}" alt="" />`);
  }
  const reviewTextareas = document.querySelectorAll(`textarea.review-text`);
  for (let i = 0; i < reviewTextareas.length; i++) {
    const targetTextarea = reviewTextareas[i];
    const textLength = targetTextarea.value.length;
    targetTextarea.style.height = (textLength / 35) * 24 + 'px';
  }
}

async function deleteReview(reviewId) {
  const res = await axios.delete(`/api/review/${reviewId}`, {
    headers: {
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  });
  if (res.status === 200) {
    confirm('리뷰를 삭제하시겠습니까?');
    location.replace('/mypage');
  } else {
    alert('리뷰 삭제에 실패했습니다.');
  }
}
