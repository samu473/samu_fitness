"use strict";

function createLoginForm() {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '';
    form.id = 'login-form';
    form.className = 'col-6 mx-auto mt-2';

    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'mb-3';

    const usernameLabel = document.createElement('label');
    usernameLabel.setAttribute('for', 'username');
    usernameLabel.className = 'form-label';
    usernameLabel.textContent = 'Username';

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.className = 'form-control';
    usernameInput.id = 'username';
    usernameInput.required = true;
    usernameInput.autocomplete = 'username';

    usernameDiv.appendChild(usernameLabel);
    usernameDiv.appendChild(usernameInput);

    const passwordDiv = document.createElement('div');
    passwordDiv.className = 'mb-3';

    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.className = 'form-label';
    passwordLabel.textContent = 'Password';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.className = 'form-control';
    passwordInput.id = 'password';
    passwordInput.required = true;
    passwordInput.autocomplete = 'current-password';

    passwordDiv.appendChild(passwordLabel);
    passwordDiv.appendChild(passwordInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-outline-success';
    submitButton.textContent = 'Submit';

    form.appendChild(usernameDiv);
    form.appendChild(passwordDiv);
    form.appendChild(submitButton);

    return form;
}

export { createLoginForm };