"use strict";

function createNavLinks (isLogged) {
    console.log(isLogged);
    let firstNavItem = '';
    if (!isLogged) {
        firstNavItem = '<a class="nav-item nav-link active" data-link="mymovies" href="/mymovies">La mia lista</a>';
    }
    return `<a class="navbar-brand" href="/login">
				<svg width="32px" height="32px" fill="#ffffff" stroke="#ffffff" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
					<path d="m503.35 214.27h-14.765v-12.181c0-25.301-18.441-46.365-42.587-50.49v-1.262c0-28.25-22.985-51.235-51.236-51.235s-51.236 22.985-51.236 51.235v63.933h-175.06v-63.932c0-28.25-22.985-51.235-51.236-51.235s-51.236 22.985-51.236 51.235v1.262c-24.146 4.125-42.587 25.188-42.587 50.49v12.181h-14.763c-4.777 0-8.649 3.872-8.649 8.649v66.158c0 4.778 3.872 8.649 8.649 8.649h14.765v12.181c0 25.301 18.441 46.365 42.587 50.49v1.262c0 28.25 22.985 51.235 51.236 51.235s51.236-22.985 51.236-51.235v-63.933h175.06v63.933c0 28.25 22.985 51.235 51.236 51.235s51.236-22.985 51.236-51.235v-1.262c24.146-4.125 42.587-25.188 42.587-50.49v-12.181h14.765c4.778 0 8.649-3.872 8.649-8.649v-66.158c-3e-3 -4.778-3.875-8.65-8.652-8.65zm-479.94 66.159h-6.115v-48.86h6.115v48.86zm42.585 62.295c-14.536-3.834-25.289-17.092-25.289-32.816v-107.82c0-15.724 10.751-28.981 25.289-32.816v173.45zm85.174 18.936c0 18.713-15.225 33.937-33.938 33.937s-33.938-15.224-33.938-33.937v-211.32c0-18.713 15.225-33.937 33.938-33.937s33.938 15.224 33.938 33.937v211.32zm32.752-81.231h-15.454v-48.86h15.454v48.86zm126.85 0h-109.56v-48.86h109.56v48.86zm32.752 0h-15.453v-48.86h15.453v48.86zm85.172 81.231c0 18.713-15.225 33.937-33.938 33.937s-33.938-15.224-33.938-33.937v-211.32c0-18.713 15.225-33.937 33.938-33.937s33.938 15.224 33.938 33.937v211.32zm42.587-51.752c0 15.724-10.751 28.981-25.289 32.816v-173.45c14.536 3.834 25.289 17.092 25.289 32.816v107.82zm23.414-29.479h-6.115v-48.86h6.115v48.86z"/>
				</svg>
				Samu Fitness
			</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#left-sidebar" aria-controls="left-sidebar" aria-expanded="false" aria-label="Toggle sidebar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-nav m-1">
                ${firstNavItem}
            </div>
            <div class="navbar-nav m-1">
                <a class="nav-item nav-link ${(isLogged) ? 'active' : ''}" data-link="mysessions" href="/mysessions">Sessioni</a>
            </div>
            <div class="navbar-nav m-1 dropdown">
                <a role="button" class="nav-link dropdown-toggle" data-link="lists" data-bs-toggle="dropdown" aria-expanded="false">
                Altre liste
                </a>
                <ul class="dropdown-menu dropdown-menu-dark" id="users-dropdown">
                </ul>
            </div>
            <form class="d-flex my-2 mx-auto" role="search" id="search-form">
                <input class="form-control d-none d-sm-block" id="search-field" type="search" placeholder="Cerca" aria-label="Cerca" list="suggestions">
                <datalist id="suggestions"></datalist>
                <button class="btn btn-outline-success d-none d-sm-block ms-1" type="submit">Cerca</button>
            </form>
            <div class="nav-item dropstart">
                <a class="nav-link dropdown-toggle" href="#" title="Profilo utente" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="./svg/user_profile.svg" alt="user profile">
                </a>
                <ul id="profileNav" class="dropdown-menu">
                    <!-- to be completed by JS -->
                </ul>
            </div>`
}

export { createNavLinks };


  
          