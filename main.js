"use strict";
let cardOpener = document.querySelector('.js-open-card');
let card = document.querySelector('.card-backdrop');
let closeButton = document.querySelector('.remove-card-button');

function showCard() {
  card.classList.add('show');

  if (closeButton) {
    closeButton.addEventListener('click', removeCard);
  }
  window.addEventListener('keydown', handleEsc);
  card.addEventListener('click', handleSideClick);
}
function removeCard() {
  card.classList.add('out');

  function clearCardClasses(evt) {
    console.log(evt.target);
    if (evt.target == card) {
      card.classList.remove('show');
      card.classList.remove('out');

      card.removeEventListener('animationend', clearCardClasses);
    }

    card.removeEventListener('click', handleSideClick);
    window.removeEventListener('keydown', handleEsc);
    if (closeButton) {
      closeButton.removeEventListener('click', removeCard, { once: true });
    }
  }

  card.addEventListener('animationend', clearCardClasses);
}

function handleEsc(evt) {
  if (evt.key == 'Escape') {
    removeCard();
  }
}

function handleSideClick(evt) {
  if (evt.target == card) {
    removeCard();
  }
}

cardOpener.addEventListener('click', showCard);

// ========================== acc
const accordeon = document.querySelector('.faq-list');

const closePanel = (item) => {
  let panel = item.querySelector('.panel');
  item.classList.remove('opened');
  panel.style.maxHeight = `0`;
}

const openPanel = (item) => {
  let panel = item.querySelector('.panel');
  item.classList.add('opened');
  panel.style.maxHeight = `${panel.scrollHeight + 60}px`;
}
const onAccordeonClick = (evt) => {
  const target = evt.target;
  let opened = accordeon.querySelector('.opened');

  if (!target.classList.contains('js-toggle')) return;
  if (opened) {
    closePanel(opened);
  };

  let item = target.closest('div');

  if (item != opened) {
    openPanel(item);
    opened = item;
  }
}

accordeon.addEventListener('click', onAccordeonClick);


const slider = document.querySelector('#slider');
const slides = [...slider.children];
const controls = document.querySelectorAll('.container-controls');
const prevBtn = document.querySelector('.container-controls.left');
const nextBtn = document.querySelector('.container-controls.right');
let sectionWidth = slider.querySelector('.section').offsetWidth;

// let isDragging = false, startX, startScrollLeft;

let slidesPerView = Math.round(slider.offsetWidth / sectionWidth);

window.addEventListener('resize', () => {
  sectionWidth = slider.querySelector('.section').offsetWidth;
  slidesPerView = Math.round(slider.offsetWidth / sectionWidth);
})

slides.slice(-slidesPerView).reverse().forEach((slide) => {
  slider.insertAdjacentHTML('afterbegin', slide.outerHTML);
})

slides.slice(0, slidesPerView).forEach((slide) => {
  slider.insertAdjacentHTML('beforeend', slide.outerHTML);
})

controls.forEach((control) => {
  control.addEventListener('click', () => {
    slider.scrollLeft += control.id === 'left' ? -sectionWidth : sectionWidth;
  })
})

const infiniteScroll = () => {
  if (slider.scrollLeft === 0) {
    slider.classList.add('no-transition');
    slider.scrollLeft = slider.scrollWidth - (2 * slider.offsetWidth)
    slider.classList.remove('no-transition');
  } else if (Math.ceil(slider.scrollLeft) === slider.scrollWidth - slider.offsetWidth) {
    slider.classList.add('no-transition');
    slider.scrollLeft = slider.offsetWidth;
    slider.classList.remove('no-transition');
  }
}

slider.addEventListener("scroll", infiniteScroll);

// ---header animations

const header = document.querySelector('header.inner-header');

const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const currentSection = entry.target.dataset.sectionName;
      entry.target.style.scrollBehavior = 'auto';
      entry.target.scrollTop = -entry.target.scrollHeight;
      entry.target.style.scrollBehavior = 'smooth';
      const currentTitle = header.querySelector('.header-current-title');
      currentTitle.textContent = currentSection;
    }

    entry.target.style.scrollBehavior = 'auto';
    entry.target.scrollTop = -entry.target.scrollHeight;
    entry.target.style.scrollBehavior = 'smooth';
  })
}

const observer = new IntersectionObserver(callback, { threshold: 0.1 })

slides.forEach((slide) => {
  observer.observe(slide);
})

slides.forEach((slide) => {
  slide.addEventListener('scroll', () => {
    const marker = slide.querySelector('.marker');
    if (marker.getBoundingClientRect().top < 50) {
      header.classList.add('bkg-col');
    } else {
      header.classList.remove('bkg-col');
    }
  })
})



// ----------- main page

const mainPage = document.querySelector('.main-page');
const mainPageLink = mainPage.querySelector('.main-page-link');

const mainPageLinkClick = (evt) => {
  evt.preventDefault();
  const sectionId = evt.target.dataset.section;

  slider.classList.add('no-transition');
  slider.querySelector(`#${sectionId}`).scrollIntoView();
  mainPage.classList.remove('open')
  slider.classList.remove('no-transition');
}

mainPageLink.addEventListener('click', mainPageLinkClick);

// ---------------- burger(-s) 

const burgers = Array.from(document.querySelectorAll('button.burger'));
const burgerMenu = document.querySelector('section.burger-menu');
const burgerMainPageLink = document.querySelector('.burger-main-page-link');
const burgerLinks = document.querySelectorAll('.burger-link');

const onBurgerClick = (evt) => {
  burgers.forEach((burger) => {
    burger.classList.toggle('closed');
    if (!burger.classList.contains('closed')) {
      burgerMenu.classList.add('open');
      return;
    }
    burgerMenu.classList.remove('open');
    return;
  })
}

const switchOffBurgers = () => {
  burgers.forEach((burger) => {
    burger.classList.add('closed')
  })
}

const onBurgerLinkClick = (evt) => {
  evt.preventDefault();
  if (evt.target.classList.contains('burger-main-page-link')) return;
  const sectionId = evt.target.dataset.section;
  slider.classList.add('no-transition');
  slider.querySelector(`#${sectionId}`).scrollIntoView();
  burgerMenu.classList.remove('open');
  mainPage.classList.remove('open');
  switchOffBurgers();
  slider.classList.remove('no-transition');
}

const onMainLinkClick = (evt) => {
  evt.preventDefault();
  mainPage.classList.add('open');
  document.body.classList.add('light');
  burgerMenu.classList.remove('open');
  switchOffBurgers();
}

burgers.forEach((burger) => {
  burger.addEventListener('click', onBurgerClick)
})

burgerMainPageLink.addEventListener('click', onMainLinkClick);
burgerLinks.forEach((link) => {
  link.addEventListener('click', onBurgerLinkClick);
})

const currentPlayerContainer = document.querySelector('#current-player-wrapper');
const currentPlayerAction = document.querySelector('.current-player-action');
const currentPlayerScore = document.querySelector('.current-player-score');
const currentPlayerPlace = document.querySelector('.current-player-place');
const playersList = document.querySelector('.rating-list');
const playerTemplate = document.querySelector('#player-template').content;
const winnersList = document.querySelector('.winners-list');

const animateValue = (field, min, max) => {
  let startTimestamp = null;
  const diff = max - min;
  const time = diff / 1000;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / time, 1);
    field.textContent = `${(min + Math.floor(progress * diff)).toLocaleString().replaceAll(',', ' ')}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

const scoreOperations = (allScore) => {
  const starter = 6450000;
  const npf = allScore * 0.03;
  const finalValue = starter + npf;

  const animatedValue = document.querySelector('.js-prize-value');
  animateValue(animatedValue, starter, finalValue);

  const prizes = [...document.querySelectorAll('.js-prizes-prize')];
  for (let i = 0; i < prizes.length; i++) {
    switch (i) {
      case 0:
        prizes[i].textContent = `${Math.floor(2000000 + npf * 0.10).toLocaleString().replaceAll(',', ' ')} \u20B8`;
        break;
      case 1:
        prizes[i].textContent = `${Math.floor(1200000 + npf * 0.075).toLocaleString().replaceAll(',', ' ')} \u20B8`;
        break;
      case 2:
        prizes[i].textContent = `${Math.floor(700000 + npf * 0.075).toLocaleString().replaceAll(',', ' ')} \u20B8`;
        break;
      case 3:
        prizes[i].textContent = `${Math.floor(400000 + npf * 0.075).toLocaleString().replaceAll(',', ' ')} \u20B8`;
        break;
      case 4:
        prizes[i].textContent = `${Math.floor(300000 + npf * 0.075).toLocaleString().replaceAll(',', ' ')} \u20B8`;
        break;
      case 5:
        prizes[i].textContent = `${Math.floor(150000 + (npf * 0.05) / 2).toLocaleString().replaceAll(',', ' ')} \u20B8`;
        break;
      case 6:
        prizes[i].textContent = `${Math.floor(100000 + (npf * 0.05) / 3).toLocaleString().replaceAll(',', ' ')} \u20B8`;
        break;
      case 7:
        prizes[i].textContent = `${Math.floor(50000 + (npf * 0.25) / 15).toLocaleString().replaceAll(',', ' ')} `;
        break;
      case 8:
        prizes[i].textContent = `${Math.floor(10000 + (npf * 0.25) / 25).toLocaleString().replaceAll(',', ' ')}`;
        break;
    }
  }
}

const createPlayer = (data) => {
  const { nick, place, score, bgUserToken } = data;
  const player = playerTemplate.cloneNode(true);
  player.querySelector('.nick').textContent = nick;
  player.querySelector('.place').textContent = place;
  player.querySelector('.score').textContent = Math.floor(score / 100).toLocaleString().replaceAll(',', ' ');
  if (parseInt(place) <= 10) {
    const avatarImg = document.createElement('img');
    avatarImg.src = `https://sz.kz/picture?bgAvatar=${bgUserToken}`;
    player.querySelector('.winner-avatar').append(avatarImg);
  }

  return player;
}

const createAnchor = (current) => {
  if (current) {
    let players = playersList.children;
    players[current.place - 1].id = 'current-in-the-list';
    players[current.place - 1].classList.add('current-player')

    const target = document.querySelector('#current-in-the-list');


    if (current.place <= 100 && current.place > 5) {
      currentPlayerAction.classList.add('ready');
      currentPlayerAction.addEventListener('click', () => {
        target.scrollIntoView({ block: 'center', });
      })
    }
  } else {
    currentPlayerContainer.style.display = 'none';
  }
}

const onSuccessPlayers = (data, current, cb) => {
  data.forEach(element => {
    const player = cb(element);
    playersList.appendChild(player);
  });
  if (current) {
    currentPlayerPlace.textContent = current.place;
    currentPlayerScore.textContent = Math.floor(current.score / 100).toLocaleString().replaceAll(',', ' ');
  }
  createAnchor(current);
}

const onFail = (err) => {
  console.log(err);
}
const getData = async (onSuccess, onFail, playersOperator, scoreOperator) => {
  try {
    const response = await fetch(
      // './data.json'
      'https://sz.kz/srvNew?srv=lrRating&lotteryRace=58&offset=101'
    );

    if (!response.ok) {
      throw new Error('Не удалось получить данные');
    }

    const resp = await response.json();
    const data = resp.data;
    const current = resp.currentUser ? resp.currentUser : false;
    const allScore = resp.allScore ? resp.allScore : 0;
    scoreOperator(allScore);
    onSuccess(data, current, playersOperator);
  } catch (error) {
    onFail(error.message);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  getData(onSuccessPlayers, onFail, createPlayer, scoreOperations);
})