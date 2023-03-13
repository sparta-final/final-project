
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
  console.log('reviews', reviews)
}