"use strict";

function addIcon() {
    const img = document.createElement('img');
    img.src = '/svg/plus-circle.svg';
    img.alt = 'aggiungi';
    return img;
}

function unmIcon() {
    const img = document.createElement('img');
    img.src = '/svg/bell.svg';
    img.alt = 'imperdibile';
    return img;
}

function mssIcon() {
    const img = document.createElement('img');
    img.src = '/svg/bell-slash.svg';
    img.alt = 'perdibile';
    return img;
}

function pubIcon() {
    const img = document.createElement('img');
    img.src = '/svg/eye.svg';
    img.alt = 'Visibilità pubblica';
    return img;
}

function prvIcon() {
    const img = document.createElement('img');
    img.src = '/svg/eye-slash.svg';
    img.alt = 'Visibilità privata';
    return img;
}

function updIcon() {
    const img = document.createElement('img');
    img.src = '/svg/pencil-square.svg';
    img.alt = 'Modifica';
    return img;
}

function dltIcon() {
    const img = document.createElement('img');
    img.src = './svg/trash.svg';
    img.alt = 'Cancella';
    img.className = 'btn-icon p-1 rounded-5';
    return img;
}

function unmissableIcon() {
    const img = document.createElement('img');
    img.src = './svg/exclamation-triangle.svg';
    img.alt = 'Imperdibile';
    img.className = 'btn-icon p-1';
    return img;
}

function noSessionDiv() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.textContent = 'Nessuna sessione di allenamento da mostrare';
    return alertDiv;
}

function privateProfileDiv() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-secondary text-center';
    alertDiv.setAttribute('role', 'alert');

    const title = document.createElement('h2');
    title.className = 'fw-bold';
    title.textContent = 'Profilo Privato';

    const message = document.createElement('p');
    message.className = 'mt-3';
    message.textContent = 'L\'utente che hai cercato ha impostato il profilo come privato.';

    alertDiv.appendChild(title);
    alertDiv.appendChild(message);

    return alertDiv;
}

function subscribeDiv() {
    const div = document.createElement('div');
    div.className = 'd-flex flex-column align-items-center justify-content-center p-4 border rounded-3 shadow-sm bg-light';
    const icon = document.createElement('img');
    icon.src = '../svg/exclamation-circle.svg';
    icon.alt = 'Iscriviti';
    icon.className = 'mb-3 opacity-50';
    icon.style.width = '80px';

    const p = document.createElement('p');
    p.className = 'text-center fs-1 fw-bold gradient-text mb-0';

    const subscribeLink = document.createElement('a');
    subscribeLink.className = 'text-primary cursor-pointer';
    subscribeLink.textContent = 'Iscriviti';
    subscribeLink.setAttribute('data-bs-toggle', 'modal');
    subscribeLink.setAttribute('data-bs-target', '#signupModal');

    const conjunctionText = document.createTextNode(' o ');

    const loginLink = document.createElement('a');
    loginLink.className = 'text-success cursor-pointer';
    loginLink.href = '/login';
    loginLink.textContent = 'accedi';

    const staticText = document.createTextNode(' per ottenere l\'accesso a tutti i servizi');

    p.appendChild(subscribeLink);
    p.appendChild(conjunctionText);
    p.appendChild(loginLink);
    p.appendChild(staticText);

    const subText = document.createElement('p');
    subText.className = 'text-center fst-italic opacity-50';
    subText.textContent = 'Non perderti nessuna opportunità!';

    div.appendChild(icon);
    div.appendChild(p);
    div.appendChild(subText);

    return div;
}

export { addIcon, unmIcon, mssIcon, pubIcon, prvIcon, updIcon, dltIcon, unmissableIcon, noSessionDiv, subscribeDiv, privateProfileDiv };