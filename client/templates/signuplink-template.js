"use strict";

function createSignupLink () {
    const div = document.createElement('div');
    div.className = 'navbar-nav m-1 justify-content-end';

    const link = document.createElement('a');
    link.className = 'nav-item nav-link btn btn-outline-primary d-flex align-items-center gap-2 rounded-pill px-3 py-2';
    link.href = '/signup';
    link.dataset.bsToggle = 'modal';
    link.dataset.bsTarget = '#signupModal';

    const img = document.createElement('img');
    img.src = '../svg/person-fill-add.svg';
    img.alt = 'Signup';
    img.className = 'img-fluid'; 

    link.appendChild(img);
    link.appendChild(document.createTextNode('Signup'));

    div.appendChild(link);

    return div;
}

export { createSignupLink };