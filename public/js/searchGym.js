const searchBtn = document.querySelector('.search');
const searchBox = document.querySelector('.search-box');
const searchSubmit = document.querySelector('.search-submit');
const searchInput = document.querySelector('.search-input');
searchBtn.addEventListener('click', () => {
  searchBox.classList.toggle('show');
});
searchBtn.addEventListener('click', (e) => {
  let $header = e.target.parentElement.parentElement.nextElementSibling;
  if (e.target.nextElementSibling.classList.value === 'search-box show') {
    $header.style.marginBottom = '35px';
    searchInput.focus();
  } else {
    $header.style.marginBottom = '0px';
    searchInput.blur();
  }
});

searchSubmit.addEventListener('click', () => {
  const text = searchInput.value;
  searchBox.classList.remove('show');
  location.href = `/searchGym?text=${text}`;
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const text = searchInput.value;
    searchBox.classList.remove('show');
    location.href = `/searchGym?text=${text}`;
  }
});

async function searchGymByText(text) {
  const response = await axios({
    method: 'get',
    url: `/api/gym/search/${text}`,
  });
  const data = response.data;
  console.log(data);

  for (const gym of data) {
    let gymId = gym.id;
    let name = gym.name;
    let address = gym.address;
    let gymImg = gym.gymImgs[0].img;
    let temp = `
          <div class="gym-approve-wait">
            <img src="${gymImg}"  alt="" />
            <ul class="gym-info-box">
              <li class="gym-name">${name}</li>
              <li class="gym-location">${address}</li>
              <li class="gym-review-${gymId}"></li>
              <button onclick="location.href='/gym/gymDetail?gym=${gymId}'" >가맹점 상세 정보</button>
            </ul>
          </div>
          `;
    $('.approve-wait').append(temp);
    const res = await axios({
      method: 'get',
      url: `/api/gym/${gymId}/review`,
    });
    const reivewsLength = res.data.reviews.length;
    let avgStar = `
          <span class="gym-star">⭐${res.data.avgStar}(${reivewsLength})</span>
          `;
    $(`.gym-review-${gymId}`).append(avgStar);
  }
}

// location.href='/user/qrcode'
// function qrCode() {
//   const userType = localStorage.getItem('type');
//   if (!userType) {
//     window.location.href = '/user/login';
//   }
//   if (userType === 'user') {
//     window.location.href = '/user/qrcode';
//   }
//   if (userType === 'business') {

//   }
// }
