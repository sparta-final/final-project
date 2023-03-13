const query = new URLSearchParams(window.location.search);
const gymId = query.get('gymId');

// 별점 가져오기
$("input[name=star_rating]").click(function () {
  let click_star_rating = $(this).attr("value");
  console.log("click_star_rating = ", click_star_rating);
  star_rating = Number(click_star_rating);
});

/**
 * @description: 리뷰 작성
 * @author: 김승일
 */
async function postReview(gymId) {
  const formData = new FormData();
  await axios.post(`/api/gym/${gymId}/review`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      accesstoken: `${localStorage.getItem('at')}`,
      refreshtoken: `${localStorage.getItem('rt')}`,
    },
  });
}