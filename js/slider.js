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

const observer = new IntersectionObserver(callback, {threshold: 0.1})

slides.forEach((slide) => {
  observer.observe(slide);
})

slides.forEach((slide) => {
  slide.addEventListener('scroll', () => {
    const marker = slide.querySelector('.marker');
    if (marker.getBoundingClientRect().top < 140) {
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