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
      0: '0',
      0.5: '1',
      1: '2',
      1.5: '3',
      2: '4',
      2.5: '5',
      3: '6',
      3.5: '7',
      4: '8',
      4.5: '9',
      5: '10',
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
      <img class="reviews-star" src="//www.sixpack.pro/images/star_rating_${starString}.png" alt="" />
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
  const targetTextarea = reviewTextareas[0];
  const textLength = Math.ceil(targetTextarea.value.length / 24);
  targetTextarea.style.height = textLength * 24 + 'px';
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
    toastr.error('리뷰 삭제에 실패했습니다.', '오류', { timeOut: 1500, positionClass: "toast-top-center", closeButton: true, progressBar: true, preventDuplicates: true });
  }
}
