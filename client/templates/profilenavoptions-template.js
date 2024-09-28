"use strict";

function createProfOption (option) {
    const li = document.createElement('li');
    const button = document.createElement('button');

    button.classList.add('dropdown-item', 'text-capitalize', 'small');
    button.setAttribute('data-id', option);
    button.textContent = option;

    li.appendChild(button);
    return li;
}

export { createProfOption };