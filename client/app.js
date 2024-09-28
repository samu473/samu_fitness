"use strict";

import SessionManager from './sessionManager.js';
import Filter from './filter.js';
import { createNavLinks } from './templates/navbar-template.js';
import { createMainContainer } from "./templates/main-template.js";
import { createLoginForm } from './templates/login-template.js';
import { createSignupLink } from './templates/signuplink-template.js';
import { getUser, getUserByUsername, updUser, doLogin, doLogout, doSignup, checkSession, getProfile, updPrivacy } from './userManager.js';
import { createAlert } from './templates/alert-template.js';
import { createTR } from './templates/sessionrow-template.js';
import { noSessionDiv, subscribeDiv, privateProfileDiv } from './templates/icons-template.js';
import { createProfOption } from './templates/profilenavoptions-template.js';
import { createSectorsDropdown } from './templates/sectors-template.js';
import { createProfilePage } from './templates/profilepage-template.js';


class App {
    constructor(navbar, mainContainer) {
        this.mainContainer = mainContainer;
        this.navbar = navbar;

        page('/', () => {
            this.currentPage = 'guest';
            this.isAdmin = false;
            this.setUpGuestPage();
        });

        
        page('/login', () => {
            this.currentPage = 'login';
            this.isAdmin = false;
            this.loginPage();
            
        });

        page('/mysessions', () => {
            checkSession()
            .then(() => {
                this.currentPage = 'mysessions';
                this.isAdmin = true;
                this.sessionsPage();
            })
            .catch((err) => {
                this.showErrorMsg(err);
                page.redirect('/login');
            })
        });
        
        page('/search', (ctx) => {
            const params = new URLSearchParams(ctx.querystring);
            const username = params.get('username');
            this.currentPage = 'search/' + username;
            this.isAdmin = false;
            this.sessionsPage();
        });

        page('/myprofile', () => {
            checkSession()
            .then(() => {
                this.profilePage();
            })
            .catch((err) => {
                this.showErrorMsg(err);
                page.redirect('/login');
            })
        });

        page('/logout', this.logout);

        page('*', this.notfound);

        page();
    }

    setUpGuestPage(){
        this.isLogged = false;
        this.isAdmin = false;
        this.sessionManager = new SessionManager();

        this.mainContainer.innerHTML = '';
        this.mainContainer.appendChild(subscribeDiv());
        
        
        this.navbar.innerHTML = '';
        const navLinks = createNavLinks(this.isLogged);
        this.navbar.appendChild(navLinks);
        
        this.navbar.querySelector('#navUsername').innerHTML = 'Ospite';

        const searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', this.onSubmitSearch);

        this.setupProfileNav(this.isLogged);

        const signupLink = document.getElementById("signupLink");
        signupLink.innerHTML = '';
        signupLink.appendChild(createSignupLink());
        signupLink.hidden = true;

        document.querySelector("#signupModal form").addEventListener("submit", this.onSubmitSignup);
    }

    initLoggedPage(user) {
        this.isAdmin = true;
        this.isLogged = true;
        this.userId = user.id;

        this.navbar.hidden = false;
        this.sidebar = document.getElementById("left-sidebar");

        this.navbar.querySelector('#mySessionsLink').hidden = false;

        this.setupProfileNav(this.isLogged);
        const searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', this.onSubmitSearch);
    }

    loginPage() {
        try {
            this.navbar.hidden = true;

            this.mainContainer.hidden = true;

            document.getElementById("profile").innerHTML = '';
            document.getElementById("profile").appendChild(createLoginForm());
            document.getElementById("profile").hidden = false;

            document.getElementById('login-form').addEventListener('submit', this.onSubmitLogin);
            
            document.getElementById("signupLink").hidden = false;
            const signupModal = document.getElementById("signupModal");
            if (signupModal) {
                signupModal.addEventListener('show.bs.modal', event => {
                    signupModal.querySelector("form").classList.remove('was-validated');
                    signupModal.querySelector("form").reset();
                })
            }
        } catch(error) { 
            this.showErrorMsg(error);
        }
    }

    onSubmitLogin = (event) => {
        event.preventDefault();
        const form = event.target;

        if(form.checkValidity()) {
            doLogin(form.username.value, form.password.value)
            .then((user) => {
                page.redirect('/mysessions');
                this.initLoggedPage(user);
                const alertMessage = document.getElementById('alert-message');
                alertMessage.appendChild(createAlert('success', `Welcome ${user.username}!`));
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);                
            })
            .catch((error) => this.showErrorMsg(error));
        }
    }

    onSubmitSignup = async (event) => {
        event.preventDefault();
        const form = event.target;
        if (form.checkValidity()) {
            try {
                const userObj = {
                    firstname: form.firstname.value,
                    lastname: form.lastname.value,
                    username: form.newusername.value,
                    password: form.newpassword.value,
                    email: form.email.value
                }
                const user = await doSignup(userObj);
                document.querySelector("#signupModal .btn-close").click();
                const alertMessage = document.getElementById('alert-message');
                alertMessage.appendChild(createAlert('success', `${user.username}'s registration complete!`));
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);
        
                form.classList.remove('was-validated');
                page.redirect('/login');
            } catch (error) {
                this.showErrorMsg(error);
            }
        }
        form.classList.add('was-validated');
    }

    showErrorMsg = async (error) => {
        const errorMsg = error;
        const alertMessage = document.getElementById('alert-message');
        alertMessage.appendChild(createAlert('danger', errorMsg));
        setTimeout(() => {
            alertMessage.innerHTML = '';
        }, 3000);
    }

    sessionsPage() {
        this.sessionManager = new SessionManager();

        this.mainContainer.innerHTML = '';
        createMainContainer().forEach((el) => this.mainContainer.appendChild(el));
        this.mainContainer.hidden = false;
        this.mainContainer.querySelector('#new-session-btn').hidden = !this.isAdmin;

        this.sessionsContainer = document.getElementById("session-container");
        this.sidebar = document.getElementById("left-sidebar");
        this.sessionsContainer = document.getElementById("session-list");
        this.fillSessionsContainer();
        document.getElementById("profile").hidden = true;
        document.getElementById("signupLink").hidden = true;
        
        this.manageFilters();
        this.initModals();
    }

    fillSessionsContainer = () => {
        if (this.currentPage==='mysessions') {
            document.getElementById("table-title").innerText = `I tuoi allenamenti`;
            this.showUserSessions(this.userId);
        } else {
            const otherUsername = this.currentPage.split('/')[1];
            document.getElementById("table-title").innerText = `Allenamenti di ${otherUsername}`;
            getUserByUsername(otherUsername)
            .then((otherUser) => {
                if(otherUser.id === this.userId) page.redirect('/mysessions');
                else getProfile(otherUser.id)
                .then((profile) => {
                    if(profile.private) {
                        let sessionTable = this.sessionsContainer.querySelector("table > tbody");
                        sessionTable.innerHTML = '';
                        document.getElementById("session-list").classList.remove("session-list");
                        sessionTable.appendChild(privateProfileDiv());
                    } else this.showUserSessions(otherUser.id);
                })
                .catch((err) => {
                    if(this.isLogged) page.redirect('/mysessions');
                    else page.redirect('/');
                    this.showErrorMsg(err);
                });
            })
            .catch((err) => {
                if(this.isLogged) page.redirect('/mysessions');
                else page.redirect('/');
                this.showErrorMsg(err);
            });
        }
    }

    showSessions(sessions) {
        let sessionTable = this.sessionsContainer.querySelector("table > tbody");
        sessionTable.innerHTML = '';
        if (sessions && sessions.length) {
            document.getElementById("session-list").classList.add("session-list");
            sessions.forEach((session) => {
                sessionTable.appendChild(createTR(session));
                const toggle = (this.isLogged && this.isAdmin) ? 'modal' : '';
                document.getElementById(`dlt-${session.id}`).setAttribute('data-bs-toggle', toggle);
                document.getElementById(`done-${session.id}`).disabled = !(this.isLogged && this.isAdmin);
                    document.getElementById(`done-${session.id}`).addEventListener('change',  (e) => {
                        this.onChangeDone(e, session);
                    });
                    document.getElementById(`dlt-${session.id}`).addEventListener('click', () => {
                        this.setDeleteSession(session);
                    });
                
            });
        }
        else { 
            document.getElementById("session-list").classList.remove("session-list");
            sessionTable.appendChild(noSessionDiv());
        }
        this.createFilterList();
    }

    showUserSessions(userId) {
        this.sessionManager.getUserSessionList(userId)
        .then(() => {
            this.showSessions(this.sessionManager.sessions);
        }).catch((error) => { 
            if (!userId) {
                page.redirect('/login');
            }
            this.showUserSessionsTable([],this.userId);
            this.showErrorMsg(error);
        });
    }

    showUserSessionsTable(sessions, userId) {
        let sessionTable = this.sessionsContainer.querySelector("table > tbody");
        sessionTable.innerHTML = '';
        if(userId != this.userId){
            getProfile(userId)
            .then((profile) => {
                if(profile.private) {
                    let sessionTable = this.sessionsContainer.querySelector("table > tbody");
                    sessionTable.innerHTML = '';
                    document.getElementById("session-list").classList.remove("session-list");
                    sessionTable.appendChild(privateProfileDiv());
                    return;
                }
            })
            .catch((err) => {
                if(this.isLogged) page.redirect('/mysessions');
                else page.redirect('/');
                this.showErrorMsg(err);
            });
        }
        if (sessions && sessions.length) {
            document.getElementById("session-list").classList.add("session-list");
            sessions.forEach((session) => {
                sessionTable.appendChild(createTR(session));
                const toggle = (this.isLogged && this.isAdmin) ? 'modal' : '';
                document.getElementById(`dlt-${session.id}`).setAttribute('data-bs-toggle', toggle);
                document.getElementById(`done-${session.id}`).disabled = !(this.isLogged && this.isAdmin);
                    document.getElementById(`done-${session.id}`).addEventListener('change',  (e) => {
                        this.onChangeDone(e, session);
                    });
                    document.getElementById(`dlt-${session.id}`).addEventListener('click', () => {
                        this.setDeleteSession(session);
                    });
            });
        } else { 
            document.getElementById("session-list").classList.remove("session-list");
            sessionTable.appendChild(noSessionDiv());
        }
    }

    onClickRemove = (session) => {
        setDeleteModal(session)
        .then(() => {
            this.showUserSessions(this.userId);
            this.triggerClickActiveFilter();
        })
        .catch((error) => this.showErrorMsg(error));
    }

    setDeleteSession(session){
        this.dltSession = session;
    }

    onChangeDone(event, session) {
        session.done = event.target.checked;
        this.sessionManager.updSessionInWishList(this.userId, session)
            .then()
            .catch(err => {throw err});
    }

    manageFilters() {
        this.sidebar.querySelectorAll('div > a').forEach( el_a => {
            el_a.addEventListener('click', e => {
                const el = e.target;
                const filterType = el.dataset.id;
                this.sidebar.querySelector('.active').classList.remove('active');
                el.classList.add('active');
                let filter = new Filter(this.sessionManager, filterType);
                let sessions = filter.apply();
                let title = document.getElementById("filter-title");
                title.innerText = this.sidebar.querySelector("a.active").innerText;
                if (this.currentPage === 'mysessions') {
                    this.showUserSessionsTable(sessions, this.userId);
                } else {
                    const otherUsername = this.currentPage.split('/')[1];
                    getUserByUsername(otherUsername)
                    .then((user) => {
                        this.showUserSessionsTable(sessions, user.id);
                    })
                    .catch((err) => this.showErrorMsg(err));
                }
            });
        });
    }

    initModals() {
        if(this.modalsInit) return;
        //AddnewSession
        const addNewSession = (event) => {
            const form = newSessionModal.querySelector(".needs-validation");
            form.classList.add('was-validated');
            if (form.checkValidity()) {
                const session = {
                    date: newSessionModal.querySelector("#session-date").value,
                    unmissable: newSessionModal.querySelector("#session-unmissable").checked,
                    done: false
                }
                session.sector = [];
                newSessionModal.querySelectorAll("#session-sector option").forEach (opt => {
                    if(opt.selected) {
                        session.sector.push(opt.value);
                    }
                });
                let temp = null;
                newSessionModal.querySelectorAll("input[name = 'diff-opt']").forEach( opt => {
                    if(opt.checked && (!temp)){
                        session.difficulty = document.querySelector(`label[for="${opt.id}"]`).innerHTML;
                    }
                });
                this.sessionManager.addSessionInList(this.userId, session)
                .then(() => {
                    this.sessionsPage();
                })
                .catch((err) => this.showErrorMsg(err.msg));
                
                this.createFilterList();
                document.getElementById("close-modal").click();
            }
            form.classList.add('was-validated');
        }
        const newSessionModal = document.getElementById("newSessionModal");

        //newSessionModal
        
        newSessionModal.addEventListener('show.bs.modal', event => {
            const form = newSessionModal.querySelector("form");
            form.classList.remove('was-validated');
            form.reset();
        });

        SessionManager.sectors.forEach(sec => {
            let option = document.createElement('option');
            option.setAttribute('value', sec);
            option.innerText = sec;
            newSessionModal.querySelector("#session-sector").appendChild(option);
        });

        const addSessionBtn = newSessionModal.querySelector("#add-session");
        addSessionBtn.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            addNewSession(event);
        });

        //dltSessionModal

        const dltSessionModal = document.getElementById("dltSessionModal");
        const dltButton = dltSessionModal.querySelector('#dlt-session');
        dltButton.addEventListener('click', () => {
            this.sessionManager.dltSessionFromList(this.userId, this.dltSession)
            .then(() => {
                this.sessionsPage();
            })
            .catch((err) => this.showErrorMsg(err));
        });
       this.modalsInit = true;
    }

    onSubmitSearch = (event) => {
        event.preventDefault();
        const searchField = document.getElementById('search-field');
        const query = searchField.value;
        const apiUrl = `/search?username=${encodeURIComponent(query)}`;
        page.redirect(apiUrl);
    };

    createFilterList() {
        let dd_menu = this.sidebar.querySelector(".dropdown-menu");
        dd_menu.innerHTML = '';
        dd_menu.appendChild(createSectorsDropdown(this.sessionManager.getSectors()));
        this.createFiltersBySectors();
    }
    
    createFiltersBySectors() {
        this.sidebar.querySelectorAll('.dropdown-menu a').forEach ( cat => {
            cat.addEventListener('click', e => {
                const el = e.target;
                const sector = el.dataset.id;
                this.sidebar.querySelectorAll('.active').forEach(
                    el => el.classList.remove('active')
                );
                document.getElementById("sector").classList.add('active');
                el.classList.add('active');
                let filter = new Filter(this.sessionManager, 'sector');
                let sessions = filter.apply(sector);
                let header = document.getElementById("filter-title");
                header.innerText = `Settore: ${el.innerText}`;
                this.showSessions(sessions);
                this.updateActiveCategory(sector);
            });
        });
    }

    updateActiveCategory(filterCat) {
        let dd_menu = this.sidebar.querySelector(".dropdown-menu");
        dd_menu.querySelector('a.active').classList.remove('active');
        dd_menu.querySelector(`a[data-id="${filterCat}"`).classList.add('active');
    }

    logout = async () => {
        await doLogout();
        this.userId = null;
        page.redirect('/');
    }

    setupProfileNav(isLogged){
        const ddProf = document.getElementById("profileNav");
        ddProf.innerHTML = '';
        if(isLogged){
            getUser(this.userId)
            .then((user) =>{
                const navUsername = this.navbar.querySelector('#navUsername');
                navUsername.innerHTML = user.firstname + ' ' + user.lastname;
            });

            ddProf.appendChild(createProfOption('Logout'));
            const logoutOpt = ddProf.querySelector('button[data-id="Logout"]');
            logoutOpt.setAttribute('data-bs-toggle', 'modal');
            logoutOpt.setAttribute('data-bs-target', '#logoutModal');

            ddProf.appendChild(createProfOption('Profilo'));
            const profileOpt = ddProf.querySelector('button[data-id="Profilo"]');
            profileOpt.addEventListener('click', () => page.redirect('/myprofile'))
        } else {
            ddProf.appendChild(createProfOption('Login'));
            const loginOpt = ddProf.querySelector('button[data-id="Login"]');
            loginOpt.addEventListener('click', () => page.redirect('/login'));
            ddProf.appendChild(createProfOption('Signup'));
            const subOpt = ddProf.querySelector('button[data-id="Signup"]');
            subOpt.setAttribute('data-bs-toggle', 'modal');
            subOpt.setAttribute('data-bs-target', '#signupModal');
        }
    }

    profilePage(){
        this.mainContainer.innerHTML = '';
        this.mainContainer.appendChild(createProfilePage());
        getUser(this.userId)
        .then((user) => {
            const title = this.mainContainer.querySelector('#profTitle');
            title.innerHTML = user.firstname + ' ' + user.lastname;
        });
        const toggleButton = this.mainContainer.querySelector('#toggleProfile');
        getProfile(this.userId)
        .then((profile) => {
            if(profile.private){
                toggleButton.classList.remove('btn-outline-primary');
                toggleButton.classList.add('btn-outline-danger');
                toggleButton.textContent = 'Profilo Privato';
            } else {
                toggleButton.classList.remove('btn-outline-danger');
                toggleButton.classList.add('btn-outline-primary');
                toggleButton.textContent = 'Profilo Pubblico';
            }
        })
        .catch((err) => this.showErrorMsg(err));
        toggleButton.addEventListener('click', () => updPrivacy(this.userId));
        this.sessionManager.getUserSessionList(this.userId)
        .then(() => {
            const sessionNumText = this.mainContainer.querySelector('#totaleSessioniPianificate');
            sessionNumText.innerHTML = this.sessionManager.sessions.length;
            const sessionDoneText = this.mainContainer.querySelector('#totaleSessioniSvolte');
            sessionDoneText.innerHTML = this.sessionManager.sessions.filter((s) => s.done).length;
            const sessionPercText = this.mainContainer.querySelector('#valorePercSessioniSvolte');
            const percentage = (this.sessionManager.sessions.filter((s) => s.done).length / this.sessionManager.sessions.length * 100).toFixed(1);
            sessionPercText.innerHTML = isNaN(percentage) ? 0 : percentage;
            const sessionUndoneText = this.mainContainer.querySelector('#sessioniImperdibiliNonSvolte');
            sessionUndoneText.innerHTML = new Filter(this.sessionManager, 'undone').apply().filter((s) => s.unmissable).length;
        })
    }

    notfound = () => {
        this.showErrorMsg('Pagina non trovata');
        page.redirect('/');
    }
}

export default App;