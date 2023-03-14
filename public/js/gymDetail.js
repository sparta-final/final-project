// 쿼리스트링 추출
const url = new URL(window.location.href);
const gymId = url.searchParams.get("gym");


$(document).ready(function () {
  getGymDetail();
});

/**
 * @description 헬스장 상세정보와 리뷰 출력
 * @author 김승일
 */
async function getGymDetail() {
  const gymDetail = await axios({
    method: 'get',
    url: `/api/gym/${gymId}`,
  });
  const imgs = gymDetail.data.gymImgs;
  for (i in imgs) {
    const img = imgs[i];
    const imgSrc = img.img;
    const imgTemp = `
      <li><img src="${imgSrc}" id="gym-img" /></li>
    `
    $('.gym-bxslider').append(imgTemp)
  }
  $(function () {
    $('.gym-bxslider').bxSlider({
      stopAutoOnClick: true,
      pager: false,
      controls: false,
      slideWidth: 600,
      autoControlsCombine: true,
      keyboardEnabled: true,
      autoHover: true,
    });
  });

  const gymData = gymDetail.data;

  const reviews = await axios({
    method: 'get',
    url: `/api/gym/${gymId}/review`,
  });
  const reviewData = reviews.data;
  const reivewsLength = reviewData.reviews.length;
  let avgStar = `⭐${reviewData.avgStar}(${reivewsLength}) `;

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
  const gymName = gymData.name;
  const gymNameWrap = `
  <span class="gym-detail-name">${gymName}</span>
  <span class="gym-detail-star">${avgStar}</span>
</div>
  `
  $('.gym-name-wrap').append(gymNameWrap);

  const gymAddress = gymData.address;
  $('.gym-detail-address').append(gymAddress);

  const gymDescription = gymData.description;
  const gymPhone = gymData.phone;
  const descText = `
    ${gymDescription}

    이용시간
    평일 06:00 ~ 23:00
    주말 07:00 ~ 21:00
    ☎️ ${gymPhone}
  `
  $('.gym-detail-desc').append(descText);

  const reveiewsdetail = reviewData.reviews;
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
      </div>

    `
    $('.review-wrap').append(reviewTemp);
  }
  const reviewTextareas = document.querySelectorAll(`textarea.review-text`);
  for (let i = 0; i < reviewTextareas.length; i++) {
    const targetTextarea = reviewTextareas[i];
    const textLength = targetTextarea.value.length;
    targetTextarea.style.height = textLength / 35 * 24 + 'px';
  }
}
