"use strict";

async function getUser (id) {
    if(!id) throw ('Username invalido');
    let response = await fetch(`/users/${id}/`);
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user; 
    }
}

async function getUserByUsername(username){
    if(!username) throw ('Username invalido');
    let response = await fetch(`/users/user/${username}/`);
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user;
    }
}

async function getUsers() {
    let response = await fetch(`/users`);
    const users = await response.json();
    if (response.ok) {
        return users;
    } else {
        throw users;
    }
}

async function updUser(userId,user) {
    const response = await fetch(`/users/${userId}`, {
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

async function doLogin(username, password) {
    let response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
    });
    const user = await response.json();
    if(response.ok) {
        return user;
    } else {
        throw user;
    }
}

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
            throw errDetail.msg;
        }
        catch(err) {
            throw err.msg;
        }
    }
}

async function doLogout() {
    const response = await fetch('/logout', { method: 'DELETE' });
    if (!response.ok) {
        throw response;
    } 
}

async function checkSession() {
    try {
        const response = await fetch('/check', {
            method: 'GET',
            credentials: 'include'
        });
        const user = await response.json();
        if (!response.ok) {
            throw user;
        }
        return user;
    } catch (err) {
        throw err;
    }
}

async function getProfile(userId){
    let response = await fetch(`/users/${userId}/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const profile = await response.json();
    if (response.ok) {
        return profile;
    } else {
        throw profile.msg;
    }
}

async function updPrivacy(userId){
    let response = await fetch(`/users/${userId}/profile/privacy`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const res = await response.json();
        throw res;
    }
}

export { getUser, getUserByUsername, getUsers, updUser, doLogin, doLogout, doSignup, checkSession, getProfile, updPrivacy };

