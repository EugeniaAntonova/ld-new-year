"use strict";

const sliderMob = document.querySelector('#swiperMobile .swiper-wrapper');
let outputsMob = [...sliderMob.querySelectorAll('.js-prize-value-mob')];
let slidesMob = [...sliderMob.querySelectorAll('.swiper-slide')].filter((slide) => slide.querySelector('.js-prize-value-mob'));

let countMob = 0;

const animateValueMob = (field, max, time) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / time, 1);
        field.textContent = `${Math.floor(progress * max).toLocaleString().replaceAll(',', ' ')}`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

const scoreOperationsMob = (allScore) => {
    const starter = 3225000;
    const finalValue = starter + allScore * 0.02;
    outputsMob.forEach((output) => {
        animateValueMob(output, finalValue, 1000);
    })
}

const onErrorMob = (err) => {
    console.log(err);
}
const getCountMob = async (onFail, scoreOperator) => {
    try {
        const response = await fetch(
            'https://sz.kz/srvNew?srv=lrRating&lotteryRace=52&offset=101'
        );

        if (!response.ok) {
            throw new Error('Не удалось получить данные');
        }
        const resp = await response.json();
        countMob = resp.allScore ? resp.allScore : 0;
        scoreOperator(countMob);
    } catch (error) {
        onFail(error.message);
    }
};

sliderMob.addEventListener('transitionend', (evt) => {
    if (!evt.target.classList.contains('swiper-wrapper')) return;
    outputsMob = [...sliderMob.querySelectorAll('.js-prize-value-mob')];
    slidesMob = [...sliderMob.querySelectorAll('.swiper-slide')].filter((slide) => slide.querySelector('.js-prize-value-mob'));

    slidesMob.forEach((slide) => {
        if (slide.classList.contains('swiper-slide-duplicate-active') || slide.classList.contains('swiper-slide-active')) {
            scoreOperationsMob(countMob);
        }
    })
})

document.addEventListener('DOMContentLoaded', () => {
    getCountMob(onErrorMob, scoreOperationsMob);
})

