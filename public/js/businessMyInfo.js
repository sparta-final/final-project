const userType = localStorage.getItem('type');
if (userType !== 'business') {
  alert('사업자 로그인이 필요한 서비스입니다.');
  window.location.href = '/business/login';
}

$(document).ready(function () {
  getMyGym();
});

// 내 가게 가져오기
async function getMyGym() {
  await axios
    .get('/api/gym/my', {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then(async (res) => {
      const data = res.data;

      for (let i = 0; i < data.length; i++) {
        const id = data[i].id;
        const name = data[i].name;
        const address = data[i].address;
        const img = data[i].gymImgs[0].img;
        const isApprove = data[i].isApprove;

        const temp_html = `
                        <div class="image-text-box">
                          <img src="${img}"/>
                          <div class="text-box">
                            <h2 class="mygymName">${name}</h2>
                            <p class="my-gym-qrcode" onclick="location.href='/qrScan?id=${id}'"></p>
                            <p>${address}</p>
                            <div class="review-box">
                            <div class="gym-review-${id}"></div>
                              <button class='review-go-btn' onclick="location.href='/business/gymReview?id=${id}'">리뷰 보기</button>
                            </div>
                            <div class="mybtn">
                              <button onclick="location.href='/business/userList?id=${id}'">사용자</button> 
                              <button onclick="location.href='/business/updateGym?id=${id}'">수정</button>
                              <button onclick="deleteGym(${id})">삭제</button>
                            </div>
                          </div>
                        </div>`;
        $('#imageTextBox').append(temp_html);
        let approve = '승인 대기중';
        const approve_html = `
          <p class='before-approve'>${approve}</p>
        `;
        const $reviewBox = $('.review-box')[i];
        const $reviewBtn = $reviewBox.children[1];
        if (isApprove === 0) {
          // $(document.getElementsByClassName('review-box')[i]).before(approve_html);
          $(document.getElementsByClassName('review-box')[i]).append(approve_html);
          $reviewBtn.style.display = 'none';
        }
        await axios
          .get(`/api/gym/${id}/review`)
          .then((res) => {
            const reivewsLength = res.data.reviews.length;
            let avgStar = `
                <div class="my-gym-star">⭐<span>${res.data.avgStar}</span>(${reivewsLength})</div>
                `;
            $(`.gym-review-${id}`).append(avgStar);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// 가게 삭제
function deleteGym(id) {
  axios
    .delete(`/api/gym/${id}`, {
      headers: {
        accesstoken: `${localStorage.getItem('at')}`,
        refreshtoken: `${localStorage.getItem('rt')}`,
      },
    })
    .then((res) => {
      console.log(res);
      alert('삭제가 완료되었습니다.');
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}
