const btnMenu = document.querySelector('.btn_open');
const header = document.querySelector('#header');
btnMenu.addEventListener('click', (e) => {
    header.classList.toggle('is_active');
});
