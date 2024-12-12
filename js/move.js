const animatables = [...document.querySelectorAll('.js-show')];

const options = {
    rootMargin: "0px",
    threshold: .3,
};

function showAnimatable(entries) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.replace('invisible', 'visible');
        } else {
            entry.target.classList.replace('visible', 'invisible');
        }
    })

}

let imgObserver = new IntersectionObserver(showAnimatable, options);

animatables.forEach((item) => {
    imgObserver.observe(item);
})