"use strict";

async function getUser (id) {
    let response = await fetch(`/users/${id}/`);
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user;  // an object with the error coming from the server
    }
}

async function getUsers() {
    let response = await fetch(`/users`);
    const users = await response.json();
    if (response.ok) {
        return users;
    } else {
        throw users;  // an object with the error coming from the server
    }
}

async function updUser(userId,user) {
    let response = await fetch(`/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({user}),
    });
    if (response.ok) {
        const res = await response.json();
        return res;
    }
}

/**
 * Perform the login
 */
async function doLogin(username, password) {
    let response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
    });
    if(response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch(err) {
            throw err;
        }
    }
}

/**
 * Perform the signup
 */
async function doSignup(user) {
    let response = await fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({user}),
    });
    if(response.ok) {
        return user;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch(err) {
            throw err;
        }
    }
}

/**
 * Perform the logout
 */
async function doLogout() {
    const response = await fetch('/logout', { method: 'DELETE' });
    if (!response.ok) {
        console.log(response);
    } 
}
/**
 * Check if user's session is valid
 */

async function checkSession(isAdmin=false) {
    try {
        const response = await fetch(`/check?isAdmin=${isAdmin}`, {
            method: 'GET',
            credentials: 'include' // Questo assicura che i cookie di sessione vengano inviati
        });

        if (response.ok) {
            const user = await response.json();
            if (user) {
                console.log('Sessione valida');
                return user;
            } else {
                console.log('Sessione non valida');
                // Reindirizza alla pagina di login
                window.location.href = '/login';
            }
        } else {
            console.error('Errore durante il controllo della sessione');
            // Gestisci l'errore come appropriato
        }
    } catch (error) {
        console.error('Errore di rete', error);
        // Gestisci l'errore di rete
    }
}

export { getUser, getUsers, updUser, doLogin, doLogout, doSignup, checkSession };

