async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

async function importPage(target, component) {
    document.querySelector('#' + target).innerHTML = await fetchHtmlAsText(
        '/inc/' + component + '.html',
    );
    await btnActive();
}

async function btnActive() {
    const btnMenu = document.querySelector('.btn_open');
    const header = document.querySelector('#header');
    btnMenu.addEventListener('click', (e) => {
        header.classList.toggle('is_active');
    });
}

importPage('header', 'nav');
