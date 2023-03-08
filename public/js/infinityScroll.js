const cards = document.querySelectorAll('.card');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('show', entry.isIntersecting);
      if (entry.isIntersecting) observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.5,
    rootMargin: '100px',
  }
);

const lastCardObserver = new IntersectionObserver(
  (entries) => {
    const lastCard = entries[0];
    if (!lastCard.isIntersecting) return;
    getGym();
    lastCardObserver.unobserve(lastCard.target);
  },
  {
    threshold: 0,
  }
);

const cardContainer = document.querySelector('.card-container');
let postCount = 0;
let loading = false;
const limit = 5;
let rows = [];

function loadNewCards(name) {
  const card = document.createElement('div');
  card.textContent = `${name}`;
  card.classList.add('card');
  cardContainer.append(card);
  observer.observe(card);
}

function getGym() {
  if (loading) return;
  loading = true;
  axios
    .get('api/gym', {
      params: {
        offset: postCount,
        limit,
      },
    })
    .then((res) => {
      rows = res.data; // rows를 업데이트
      if (postCount === 0) {
        cardContainer.innerHTML = '';
        for (let i = 0; i < limit && i < rows.length; i++) {
          const name = rows[i]['name'];
          loadNewCards(name);
        }
        postCount += limit;
      } else {
        const remainingPosts = rows.slice(postCount);
        const maxPostsToLoad = Math.min(limit, remainingPosts.length);
        for (let i = 0; i < maxPostsToLoad; i++) {
          const name = remainingPosts[i]['name'];
          loadNewCards(name);
        }
        postCount += maxPostsToLoad;
      }
      if (postCount >= rows.length) {
        lastCardObserver.observe(document.querySelector('.card-container:last-child .card:last-child'));
      }
      loading = false;
    })
    .catch((err) => {
      console.log(err);
    });
}

getGym();

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && postCount > 0 && postCount < rows.length) {
    getGym();
  }
});
