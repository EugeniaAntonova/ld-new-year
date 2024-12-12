"use strict";

const slider = document.querySelector('#swiperDesktop .swiper-wrapper');
let outputs = [...slider.querySelectorAll('.js-prize-value')];
let slides = [...slider.querySelectorAll('.swiper-slide')].filter((slide) => slide.querySelector('.js-prize-value'));

let count = 0;

const animateValue = (field, max, time) => {
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

const scoreOperations = (allScore) => {
    const starter = 3225000;
    const finalValue = starter + allScore * 0.02;
    outputs.forEach((output) => {
        animateValue(output, finalValue, 1000);
    })
}

const onError = (err) => {
    console.log(err);
}
const getCount = async (onFail, scoreOperator) => {
    try {
        const response = await fetch(
            'https://sz.kz/srvNew?srv=lrRating&lotteryRace=52&offset=101'
        );

        if (!response.ok) {
            throw new Error('Не удалось получить данные');
        }
        const resp = await response.json();
        count = resp.allScore ? resp.allScore : 0;
        scoreOperator(count);
    } catch (error) {
        onFail(error.message);
    }
};

slider.addEventListener('transitionend', (evt) => {
    if (!evt.target.classList.contains('swiper-wrapper')) return;
    outputs = [...slider.querySelectorAll('.js-prize-value')];
    slides = [...slider.querySelectorAll('.swiper-slide')].filter((slide) => slide.querySelector('.js-prize-value'));
    slides.forEach((slide) => {
        if (slide.classList.contains('swiper-slide-duplicate-active') || slide.classList.contains('swiper-slide-active')) {
            scoreOperations(count);
        }
    })
})

document.addEventListener('DOMContentLoaded', () => {
    getCount(onError, scoreOperations);
})

