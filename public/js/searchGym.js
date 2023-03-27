$(document).ready(function () {
  axios
    .get('/api/gym/search/서울/autocomplete')
    .then((response) => {
      const data = response.data;
      let inputSource = [];
      for (let i = 0; i < data.length; i++) {
        inputSource.push(data[i].name);
      }
      $('.search-input')
        .autocomplete({
          source: inputSource,
          minLength: 2,
          focus: function (_event, _ui) {
            return false;
          },
        })
        .on('autocompleteselect', function (_e, ui) {
          const text = ui.item.value;
          location.href = `/searchGym?text=${text}`;
        });
    })
    .catch((err) => {
      console.log(err);
    });

  searchGymByText(text);
});

const urlParams2 = new URLSearchParams(window.location.search);
const text = urlParams2.get('text');

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

const observer2 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('show', entry.isIntersecting);
    if (entry.isIntersecting) observer2.unobserve(entry.target);
  });
});

const gymContainer2 = document.querySelector('.approve-wait');
let postCount2 = 0;
let loading2 = false;
let limit2 = 7;
let data3 = [];

async function searchGymByText(text) {
  if (loading2) return;
  loading2 = true;
  await axios
    .get(`/api/gym/search/${text}/${postCount2}/${limit2}`)
    .then(async (response) => {
      const data = response.data.searchGyms;
      if (data.length === 0) {
        $('.none-search').css('display', 'block');
      }
      const ing = response.data.key;
      if (ing === 'ing') {
        await searchGymLimit(data);
        loading2 = false;
      } else {
        await searchGymLimit(data);
        loading2 = true;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

window.addEventListener('scroll', async () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !loading2) {
    await searchGymByText(text);
  }
});

async function searchGymLimit(data) {
  for (let i = 0; i < limit2 - 1 && i < data.length; i++) {
    data3.push(data[i]);
    let gymId = data[i].id;
    let name = data[i].name;
    let address = data[i].address;
    let gymImg = data[i].gymImgs[0].img;
    let temp = `
          <div class="gym-approve-wait">
            <img src="${gymImg}"   onclick="location.href='/gym/gymDetail?gym=${gymId}'" alt="" />
            <ul class="gym-info-box">
              <li class="gym-name"  onclick="location.href='/gym/gymDetail?gym=${gymId}'">${name}</li>
              <li class="gym-location">${address}</li>
              <li class="gym-review-${gymId}"></li>
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
  postCount2 += limit2 - 1;
}
