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

const lastCardObserver = new IntersectionObserver((entries) => {
  const lastCard = entries[0];
  if (!lastCard.isIntersecting) return;
  getGym();
  lastCardObserver.unobserve(lastCard.target);
  lastCardObserver.observe(document.querySelector('.card:last-child'));
}, {});

lastCardObserver.observe(document.querySelector('.card:last-child'));

cards.forEach((card) => {
  observer.observe(card);
});

const cardContainer = document.querySelector('.card-container');

function getGym() {
  axios
    .get('api/gym')
    .then((res) => {
      let rows = res.data;
      for (let i = 0; i < rows.length; i++) {
        let name = rows[i]['name'];
        loadNewCrds(name);
      }
      function loadNewCrds(name) {
        for (let i = 0; i < 1; i++) {
          const card = document.createElement('div');
          card.textContent = `${name}`;
          card.classList.add('card');
          observer.observe(card);
          cardContainer.append(card);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });

  // observer.unobserve(document.getElementById('elementToObserve'));
}
