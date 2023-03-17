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

      const reveiewsdetail = review.reviews;
      for (i in reveiewsdetail) {
        let reviewUserNickName = reveiewsdetail[i].user.nickname;
        let reviewContent = reveiewsdetail[i].reviews[0].review;
        let reviewStar = reveiewsdetail[i].reviews[0].star;
        let starString = getStarString(reviewStar);
        let reviewCreatedAt = reveiewsdetail[i].reviews[0].createdAt.slice(0, 10);
        let reviewImg = reveiewsdetail[i].reviews[0].reviewImg;
        let reviewTemp = `
        <div class="review-card">
        <div class="review-header">
        <span class="user-name">${reviewUserNickName}</span>
        <img class="review-rating" src="/images/star_rating_${starString}.jpg" alt="" />
          <span class="review-date">${reviewCreatedAt}</span>
        </div>
        <div class="review-content">
        <textarea class="review-text" cols="30" disabled>${reviewContent}</textarea>
        </div>
        </div>`;
        $('.review-wrap').append(reviewTemp);
        if (reviewImg) {
          $('.review-content').eq(i).append(`<img class="review-img-all" src="${reviewImg}" alt="" />`);
        }
      }
      const reviewTextareas = document.querySelectorAll(`textarea.review-text`);
      for (let i = 0; i < reviewTextareas.length; i++) {
        const targetTextarea = reviewTextareas[i];
        const textLength = Math.ceil(targetTextarea.value.length / 24);
        targetTextarea.style.height = textLength * 24 + 'px';
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
