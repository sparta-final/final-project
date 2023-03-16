// 쿼리스트링 추출
const url = new URL(window.location.href);
const gymId = url.searchParams.get('gym');

$(document).ready(function () {
  getGymDetail();
  const targetTextarea = document.querySelector(`.gym-detail-desc`);
  console.log('✨✨✨', '1', targetTextarea, '✨✨✨');
  const rowCount = targetTextarea.value.split(/\r\n|\r|\n/).length;
  console.log('✨✨✨', '2', rowCount, '✨✨✨');
  console.log('✨✨✨', '3', rowCount * 36, '✨✨✨');
  targetTextarea.style.height = rowCount * 36 + 'px'; //줄 수에 따라서 높이를 조절
});

/**
 * @description 헬스장 상세정보와 리뷰 출력
 * @author 김승일
 */
async function getGymDetail() {
  const gymDetail = await axios({
    method: 'get',
    url: `/api/gym/list/${gymId}`,
  });
  const imgs = gymDetail.data.gymImgs;
  console.log('✨✨✨', imgs, '✨✨✨');
  for (i in imgs) {
    const img = imgs[i];
    const imgSrc = img.img;
    const imgTemp = `
      <li><img src="${imgSrc}" id="gym-img" /></li>
    `;
    $('.gym-bxslider').append(imgTemp);
  }
  if (imgs.length > 1) {
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
  }
  const gymData = gymDetail.data;

  const reviews = await axios({
    method: 'get',
    url: `/api/gym/${gymId}/review`,
  });
  const reviewData = reviews.data;
  const reivewsLength = reviewData.reviews.length;
  let avgStar = `⭐<span>${reviewData.avgStar}</span>(${reivewsLength}) `;
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
  const gymName = gymData.name;
  const gymNameWrap = `
  <span class="gym-detail-name">${gymName}</span>
  <span class="gym-detail-star">${avgStar}</span>
</div>
  `;
  $('.gym-name-wrap').append(gymNameWrap);

  const gymAddress = gymData.address;
  $('.gym-detail-address').append(gymAddress);

  const gymDescription = gymData.description;
  const gymPhone = gymData.phone;
  const descText = `
    ${gymDescription}

    🕓 이용시간
            평일 06:00 ~ 23:00
            주말 07:00 ~ 21:00

    📞 ${gymPhone}
  `;
  $('.gym-detail-desc').append(descText);

  const reveiewsdetail = reviewData.reviews;
  for (i in reveiewsdetail) {
    let reviewUserNickName = reveiewsdetail[i].user.nickname;
    let reviewContent = reveiewsdetail[i].reviews[0].review;
    let reviewStar = reveiewsdetail[i].reviews[0].star;
    let starString = getStarString(reviewStar);
    let reviewCreatedAt = reveiewsdetail[i].reviews[0].createdAt.slice(0, 10);
    let reviewImg = reveiewsdetail[i].reviews[0].reviewImg;

    let temp = `
    <div class="review-card">
        <div class="review-header">
          <span class="user-name">${reviewUserNickName}</span>
          <img class="review-rating" src="/images/star_rating_${starString}" alt="" />
          <span class="review-date">${reviewCreatedAt}</span>
        </div>
        <div class="review-content">
          <textarea class="review-text" cols="30" disabled>${reviewContent}</textarea>
        </div>
      </div>
    `;
    $('.review-wrap').append(temp);
    if (reviewImg) {
      $('.review-content').eq(i).append(`<img class="review-img-all" src="${reviewImg}" alt="" />`);
    }
  }

  const reviewTextareas = document.querySelectorAll(`textarea.review-text`);
  for (let i = 0; i < reviewTextareas.length; i++) {
    const targetTextarea = reviewTextareas[i];
    const textLength = targetTextarea.value.length;
    targetTextarea.style.height = (textLength / 35) * 24 + 'px';
  }
}
