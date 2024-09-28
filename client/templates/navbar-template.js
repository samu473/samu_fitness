"use strict";

function createNavLinks(isLogged) {
    const navbarBrand = document.createElement('div');
    navbarBrand.className = 'navbar-brand';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '32px');
    svg.setAttribute('height', '32px');
    svg.setAttribute('fill', '#ffffff');
    svg.setAttribute('stroke', '#ffffff');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('viewBox', '0 0 512 512');
    svg.setAttribute('xml:space', 'preserve');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'm503.35 214.27h-14.765v-12.181c0-25.301-18.441-46.365-42.587-50.49v-1.262c0-28.25-22.985-51.235-51.236-51.235s-51.236 22.985-51.236 51.235v63.933h-175.06v-63.932c0-28.25-22.985-51.235-51.236-51.235s-51.236 22.985-51.236 51.235v1.262c-24.146 4.125-42.587 25.188-42.587 50.49v12.181h-14.763c-4.777 0-8.649 3.872-8.649 8.649v66.158c0 4.778 3.872 8.649 8.649 8.649h14.765v12.181c0 25.301 18.441 46.365 42.587 50.49v1.262c0 28.25 22.985 51.235 51.236 51.235s51.236-22.985 51.236-51.235v-63.933h175.06v63.933c0 28.25 22.985 51.235 51.236 51.235s51.236-22.985 51.236-51.235v-1.262c24.146-4.125 42.587-25.188 42.587-50.49v-12.181h14.765c4.778 0 8.649-3.872 8.649-8.649v-66.158c-3e-3 -4.778-3.875-8.65-8.652-8.65zm-479.94 66.159h-6.115v-48.86h6.115v48.86zm42.585 62.295c-14.536-3.834-25.289-17.092-25.289-32.816v-107.82c0-15.724 10.751-28.981 25.289-32.816v173.45zm85.174 18.936c0 18.713-15.225 33.937-33.938 33.937s-33.938-15.224-33.938-33.937v-211.32c0-18.713 15.225-33.937 33.938-33.937s33.938 15.224 33.938 33.937v211.32zm32.752-81.231h-15.454v-48.86h15.454v48.86zm126.85 0h-109.56v-48.86h109.56v48.86zm32.752 0h-15.453v-48.86h15.453v48.86zm85.172 81.231c0 18.713-15.225 33.937-33.938 33.937s-33.938-15.224-33.938-33.937v-211.32c0-18.713 15.225-33.937 33.938-33.937s33.938 15.224 33.938 33.937v211.32zm42.587-51.752c0 15.724-10.751 28.981-25.289 32.816v-173.45c14.536 3.834 25.289 17.092 25.289 32.816v107.82zm23.414-29.479h-6.115v-48.86h6.115v48.86z');

    svg.appendChild(path);
    navbarBrand.appendChild(svg);
    navbarBrand.appendChild(document.createTextNode(' Samu Fitness'));

    const navbarToggler = document.createElement('button');
    navbarToggler.className = 'navbar-toggler';
    navbarToggler.type = 'button';
    navbarToggler.setAttribute('data-bs-toggle', 'collapse');
    navbarToggler.setAttribute('data-bs-target', '#left-sidebar');
    navbarToggler.setAttribute('aria-controls', 'left-sidebar');
    navbarToggler.setAttribute('aria-expanded', 'false');
    navbarToggler.setAttribute('aria-label', 'Toggle sidebar');

    const togglerIcon = document.createElement('span');
    togglerIcon.className = 'navbar-toggler-icon';
    navbarToggler.appendChild(togglerIcon);

    const navDiv = document.createElement('div');
    navDiv.className = 'navbar-nav m-1';

    const sessionLink = document.createElement('a');
    sessionLink.className = 'nav-item nav-link active';
    sessionLink.href = '/mysessions';
    sessionLink.textContent = 'Sessioni';
    sessionLink.id = 'mySessionsLink';
    if (!isLogged) {
        sessionLink.hidden = true;
    }

    navDiv.appendChild(sessionLink);

    const searchForm = document.createElement('form');
    searchForm.className = 'd-flex my-2 mx-auto';
    searchForm.setAttribute('role', 'search');
    searchForm.id = 'search-form';

    const searchField = document.createElement('input');
    searchField.className = 'form-control d-none d-sm-block';
    searchField.id = 'search-field';
    searchField.type = 'search';
    searchField.placeholder = 'Cerca';
    searchField.setAttribute('aria-label', 'Cerca');
    searchField.setAttribute('list', 'suggestions');

    const datalist = document.createElement('datalist');
    datalist.id = 'suggestions';

    const searchButton = document.createElement('button');
    searchButton.className = 'btn btn-outline-success d-none d-sm-block ms-1';
    searchButton.type = 'submit';
    searchButton.textContent = 'Cerca';

    searchForm.appendChild(searchField);
    searchForm.appendChild(datalist);
    searchForm.appendChild(searchButton);

    const navItem = document.createElement('div');
    navItem.className = 'nav-item text-center dropstart';

    const navUsername = document.createElement('span');
    navUsername.id = 'navUsername';
    navUsername.className = 'navbar-text';
    navItem.appendChild(navUsername);

    const profileLink = document.createElement('a');
    profileLink.className = 'nav-link dropdown-toggle';
    profileLink.title = 'Profilo utente';
    profileLink.setAttribute('role', 'button');
    profileLink.setAttribute('data-bs-toggle', 'dropdown');
    profileLink.setAttribute('aria-expanded', 'false');

    const profileImage = document.createElement('img');
    profileImage.src = './svg/user_profile.svg';
    profileImage.alt = 'user profile';

    profileLink.appendChild(profileImage);

    const dropdownMenu = document.createElement('ul');
    dropdownMenu.id = 'profileNav';
    dropdownMenu.className = 'dropdown-menu dropdown-menu-end';

    navItem.appendChild(profileLink);
    navItem.appendChild(dropdownMenu);

    const navContainer = document.createElement('div');
    navContainer.className = 'navbar-container container-fluid';
    navContainer.appendChild(navbarBrand);
    navContainer.appendChild(navbarToggler);
    navContainer.appendChild(navDiv);
    navContainer.appendChild(searchForm);
    navContainer.appendChild(navItem);

    return navContainer;
}

export { createNavLinks };