// 쿼리스트링 추출
const url = new URL(window.location.href);
const gymId = url.searchParams.get("gym");

$(document).ready(function () {
  getGymDetail();
});

/**
 * @description 헬스장 상세정보
 * @author 김승일
 */
async function getGymDetail() {
  const gymDetail = await axios({
    method: 'get',
    url: `/api/gym/${gymId}`,
  });
  const gymData = gymDetail.data;
  const review = await axios({
    method: 'get',
    url: `/api/gym/${gymId}/review`,
  });
  const reviewData = review.data;
  const reivewsLength = reviewData.reviews.length;
  let avgStar = `⭐${review.data.avgStar}(${reivewsLength}) `;
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

}

