"use strict";

function createSignupLink () {
return `<div class="navbar-nav m-1 justify-content-end">
            <a class="nav-item nav-link btn-icon rounded-5" data-bs-toggle="modal" data-bs-target="#signup-modal" href="/signup">
                <img src="../svg/person-fill-add.svg"> Signup
            </a>
        </div>`;
}

export { createSignupLink };