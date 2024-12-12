"use strict";
const currentPlayerContainer = document.querySelector('#current-player-wrapper');
const currentPlayerAction = document.querySelector('.current-player-action');
const currentPlayerScore = document.querySelector('.current-player-score');
const currentPlayerPlace = document.querySelector('.current-player-place');
const playersList = document.querySelector('.rating-list');
const playerTemplate = document.querySelector('#player-template').content;
const winnersList = document.querySelector('.winners-list');

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
    console.log(allScore * 0.02);
    const finalValue = starter + allScore * 0.02;

    const animatedValue = document.querySelector('.js-prize-value');
    animateValue(animatedValue, finalValue, 1000);

    const prizes = [...document.querySelectorAll('.js-prizes-prize')];
    for (let i = 0; i < prizes.length; i++) {
        switch (i) {
            case 0:
                prizes[i].textContent = `${Math.floor(1000000 + allScore * 0.02 * 0.10).toLocaleString().replaceAll(',', ' ')} \u20B8`;
                break;
            case 1:
                prizes[i].textContent = `${Math.floor(600000 + allScore * 0.02 * 0.075).toLocaleString().replaceAll(',', ' ')} \u20B8`;
                break;
            case 2:
                prizes[i].textContent = `${Math.floor(350000 + allScore * 0.02 * 0.075).toLocaleString().replaceAll(',', ' ')} \u20B8`;
                break;
            case 3:
                prizes[i].textContent = `${Math.floor(200000 + allScore * 0.02 * 0.075).toLocaleString().replaceAll(',', ' ')} \u20B8`;
                break;
            case 4:
                prizes[i].textContent = `${Math.floor(150000 + allScore * 0.02 * 0.075).toLocaleString().replaceAll(',', ' ')} \u20B8`;
                break;
            case 5:
                prizes[i].textContent = `${Math.floor(75000 + (allScore * 0.02 * 0.05) / 2).toLocaleString().replaceAll(',', ' ')} \u20B8`;
                break;
            case 6:
                prizes[i].textContent = `${Math.floor(50000 + (allScore * 0.02 * 0.05) / 3).toLocaleString().replaceAll(',', ' ')} \u20B8`;
                break;
            case 7:
                prizes[i].textContent = `${Math.floor(25000 + (allScore * 0.02 * 0.25) / 15).toLocaleString().replaceAll(',', ' ')} `;
                break;
            case 8:
                prizes[i].textContent = `${Math.floor(10000 + (allScore * 0.02 * 0.25) / 25).toLocaleString().replaceAll(',', ' ')}`;
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
const getData = async(onSuccess, onFail, playersOperator, scoreOperator) => {
    try {
        const response = await fetch(
            './data.json'
            // 'https://sz.kz/srvNew?srv=lrRating&lotteryRace=52&offset=101'
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