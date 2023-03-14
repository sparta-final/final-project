const url = new URL(window.location.href);
const id = url.searchParams.get('id');

$(document).ready(function () {
  getGymReivew(id);
});

function getGymReivew(id) {
  axios
    .get(`/api/gym/${id}/review`)
    .then((res) => {
      const review = res.data;

      if (review.reviews.length === 0) {
        alert('리뷰가 존재하지 않습니다!');
        location.href = '/business/businessMyInfo';
      }

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

      const reveiewsdetail = review.reviews;
      for (const review of reveiewsdetail) {
        if (review.reviews.length === 0) continue;
        let reviewUserNickName = review.user.nickname;
        let reviewContent = review.reviews[0].review;
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
        let reviewTemp = `
                          <div class="review-card">
                              <div class="review-header">
                                <span class="user-name">${reviewUserNickName}</span>
                                <span class="review-star">${starString}</span>
                                <span class="review-date">${reviewCreatedAt}</span>
                              </div>
                              <div class="review-content">
                                <img class="review-img" src="${reviewImgSrc}" alt="" />
                                <textarea class="review-text" cols="30" disabled>${reviewContent}</textarea>
                              </div>
                            </div>`;
        $('.review-wrap').append(reviewTemp);
      }
      const reviewTextareas = document.querySelectorAll(`textarea.review-text`);
      for (let i = 0; i < reviewTextareas.length; i++) {
        const targetTextarea = reviewTextareas[i];
        const textLength = targetTextarea.value.length;
        targetTextarea.style.height = (textLength / 35) * 24 + 'px';
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
