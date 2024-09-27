"use strict";

import SessionManager from './sessionManager.js';
import Filter from './filters.js';
import { createNavLinks } from './templates/navbar-template.js';
import { createMainContainer } from "./templates/main-template.js";
import { createLoginForm } from './templates/login-template.js';
import { createSignupLink } from './templates/signuplink-template.js';
import { createUserSessionRow } from './templates/usersessions-template.js';
import { getUser, updUser, doLogin, doLogout, doSignup, checkSession } from './userManager.js';
import { createAlert } from './templates/alert-template.js';


class App {
    /**
     * Constructs a new instance of the MovieApp class.
     *
     * @class
     * @param {HTMLElement} sessionsContainer - The container element where movies will be displayed.
     * @param {HTMLElement} sidebar - The sidebar element containing filter links and category lists.
     */
    constructor(navbar, mainContainer) {
        // Inizializzazione delle variabili di istanza
        /**
         * @type {HTMLElement}
         * @description The container element where movies and sidebar will be displayed.
         */
        this.mainContainer = mainContainer;

        /**
         * @type {HTMLElement}
         * @description The navbar element containing links to different site's pages.
         */
        this.navbar = navbar;

        page('/', () => this.setUpGuestPage());

        
        page('/login', () => {
            this.currentPage = 'login';
            this.loginPage()
        });
        /*
        page('/mysessions', () => {
            checkSession(this.isAdmin)
            .then((user)=> {
                this.currentPage = 'mysessions';
                if(this.userId) {
                    this.moviesPage();
                } else {
                    this.initLoggedPage(user);
                    this.moviesPage();
                }
            })
             .catch((err) => {
                console.log(err);
                page.redirect('/login');
            });
        });
        */
        page('/mysessions', () => {
            this.currentPage = 'mysessions';
            console.log('MySessions');
            this.sessionsPage();
        });

/*
        page('/allmovies', () => {
            checkSession(this.isAdmin)
            .then((user)=> {
                this.currentPage = 'allmovies';
                if(this.userId) {
                    this.moviesPage();
                } else {
                    this.initLoggedPage(user);
                    this.moviesPage();
                }
            })
             .catch((err) => {
                console.log(err);
                page.redirect('/login');
            });
        });

        page('/mymovies', () => {
            checkSession(this.isAdmin)
            .then((user)=> {
                this.currentPage = 'mymovies';
                if(this.userId) {
                    this.moviesPage();
                } else {
                    this.initLoggedPage(user);
                    this.moviesPage();
                }
            })
             .catch((err) => {
                console.log(err);
                page.redirect('/login');
            });
        });
        
        page('/list/:userId', (ctx) => {
            checkSession(this.isAdmin)
            .then((user)=> {
                this.currentPage = 'mymovies';
                if(this.userId) {
                    this.currentPage = `list/${ctx.params.userId}`;
                    this.moviesPage();
                } else {
                    this.initLoggedPage(user);
                    this.moviesPage();
                }
            })
             .catch((err) => {
                console.log(err);
                page.redirect('/login');
            });
        });
        
        page('/profile', () => {
            checkSession(this.isAdmin)
            .then((user)=> {
                this.currentPage = 'profile';
                if(this.userId) {
                    this.profilePage();
                } else {
                    this.initLoggedPage(user);
                    this.profilePage();
                }
            })
             .catch((err) => {
                console.log(err);
                page.redirect('/login');
            });
        });

        page('/logout', this.logout);

        page('*', this.notfound)
*/
        page();
    }

    setUpGuestPage(){
        this.mainContainer.innerHTML = '';
        this.navbar.innerHTML = '';
        const navLinks = createNavLinks(false);
        this.navbar.insertAdjacentHTML('beforeend', navLinks);
    }

    /*
    per logged
    */
    initLoggedPage(user) {
        // Inizializzazione delle variabili di istanza
        this.isAdmin = true;
        this.userId = user.id;

        /**
         * @type {HTMLElement}
         * @description The container element where movies will be displayed.
         */

        /**
         * @type {HTMLElement}
         * @description The sidebar element containing filter links and category lists.
         */

        this.mainContainer.innerHTML = createMainContainer();
        this.sessionsContainer = document.getElementById("session-list");

        this.sidebar = document.getElementById("left-sidebar");

        this.navbar.innerHTML = '';
        const navLinks = createNavLinks(this.isAdmin);
        this.navbar.insertAdjacentHTML('beforeend', navLinks);

        // Aggiungi un event listener per gestire il clic per ogni link di filtro nella barra laterale
        this.manageFilters();
        this.manageDltSessionModal();
        // Crea la wishlist dell'utente e mostrala in tabella
    }

    /**
     * Mostra la pagina di login.
     */
    loginPage() {
        try {
            this.navbar.innerHTML = '';

            this.mainContainer.hidden = true;

            document.getElementById("profile").innerHTML = '';
            document.getElementById("profile").innerHTML = createLoginForm();
            document.getElementById("profile").hidden = false;

            document.getElementById('login-form').addEventListener('submit', this.onSubmitLogin);

            document.querySelector("#signup-modal form").addEventListener("submit", this.onSubmitSignup);
            
            document.getElementById("signup-logout").innerHTML = createSignupLink();
            const signupModal = document.getElementById("signup-modal");
            // Event listener per resettare il form quando la finestra modale si apre
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

    /**
     * Event listener for the submission of the login form. Handle the login.
     * @param {*} event 
     */
    onSubmitLogin = (event) => {
        event.preventDefault();
        const form = event.target;

        if(form.checkValidity()) {
            doLogin(form.username.value, form.password.value)
            .then((user) => {
                page.redirect('/mysessions');
                this.initLoggedPage(user);
                // welcome the user
                const alertMessage = document.getElementById('alert-message');
                alertMessage.innerHTML = createAlert('success', `Welcome ${user.username}!`);
                // automatically remove the flash message after 3 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);
                
                //page.redirect('/mysessions');
                
            })
            .catch((error) => {
                this.showErrorMsg(error);
            });
        }
    }

    /**
    * Gestisce l'evento di submit del form di registrazione.
     * Invoca l'API per registrare un nuovo utente.
     * 
     * @param {Event} event - L'evento di submit.
     */
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
                document.querySelector("#signup-modal .btn-close").click();
                // Mostra un messaggio di benvenuto all'utente
                const alertMessage = document.getElementById('alert-message');
                alertMessage.innerHTML = createAlert('success', `${user.username}'s registration complete!`);
                // Rimuove automaticamente il messaggio flash dopo 3 secondi
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

    /**
     * Mostra un messaggio di errore all'utente.
     * 
     * @param {Error} error - L'errore da visualizzare.
     */
    showErrorMsg = async (error) => {
        const errorMsg = error;
        const alertMessage = document.getElementById('alert-message');
        // add an alert message in DOM
        alertMessage.innerHTML = createAlert('danger', errorMsg);
        // automatically remove the flash message after 3 sec
        setTimeout(() => {
            alertMessage.innerHTML = '';
        }, 3000);
    }

    sessionsPage() {
        /**
         * @type {MovieManager}
         * @description The movie manager instance for handling movie-related operations.
         */
        this.sessionManager = new SessionManager();
        this.fillSessionsContainer();

        this.mainContainer.hidden=false;
        document.getElementById("profile").hidden = true;

        //this.navbar.querySelector(".active[data-link]").classList.remove("active");
        const link = (this.currentPage.includes('/')) ? "lists" : this.currentPage;
        //const navActiveLink = navLinks.querySelector(`[data-link=${link}]`);
        //navActiveLink.classList.add("active");
        console.log(this.userId);
        console.log(this.sessionManager);
        console.log(this.sessionManager.getUserSessionList(this.userId));
        this.showUserSessions(this.userId);
        this.createSectorList();
        this.initModals();
        /*this.sessionManager.getUserSessionList(this.userId)
            .then(() => {
                // Mostra i film all'avvio dell'applicazione
                this.showSessions(this.sessionManager.sessions);
                // Crea e mostra l'elenco delle categorie nella barra laterale, ognuno con un event listener
                //this.createSectorList();
                // Gestione della finestra modale per l'aggiunta di nuovi film nella wishlist
                //this.manageSessionModal();
            }).catch((err) => console.log(err));*/
            
    }

    fillSessionsContainer = () => {
        if (this.currentPage==='mysessions') {
            this.showSessions(this.userId);
            //da cancellare
        } else if (this.currentPage === 'allmovies') {
            this.showSessions();

        } else {
            const otherUserId = parseInt(this.currentPage.split('/')[1]);
            this.showSessions(otherUserId);
        }
    }

    // Metodo per mostrare i film nella tabella
    showSessions(sessions) {
        let sessionTable = this.sessionsContainer.querySelector("table > tbody");
        sessionTable.innerHTML = '';
        // controlla se la lista di sessioni è definita e se contiene almeno un elemento
        if (sessions && sessions.length) {
            document.getElementById("session-list").classList.add("session-list");
            sessions.forEach((session) => {
                let tr = this.createTR(session);
                sessionTable.appendChild(tr);
            });
        }
        else { 
            document.getElementById("session-list").classList.remove("session-list");
            sessionTable.innerHTML = App.noSessionDiv();
        }
        
    }

    showUserSessions(userId) {
        this.sessionManager.getUserSessionList(this.userId)
            .then(() => {
                // Mostra i film all'avvio dell'applicazione
                this.showSessions(this.sessionManager.sessions);
                // Crea e mostra l'elenco delle categorie nella barra laterale, ognuno con un event listener
                //this.createSectorList();
                // Gestione della finestra modale per l'aggiunta di nuovi film nella wishlist
                //this.manageSessionModal();
            }).catch((error) => { 
                if (!userId) {
                    page.redirect('/login');
                }
                this.showUserSessionsTable([],this.userId);
                this.showErrorMsg(error);
            });

        // Crea la wishlist dell'utente e mostrala in tabella
        /*
        this.sessionManager.getUserSessionList(userId)
            .then((sessions) => {
                if(userId != this.userId && !this.isAdmin) {
                    //non visualizzo se la pagina dell'utente è privata
                    this.sessionManager.sessions = sessions.filter ((m)=> m.visibility);
                }
*/
                //document.getElementById("admin-btns").hidden = true;

                // abilita i pulsanti del menu di sinistra che servono solo per i film nella lista degli utenti
                /*
                this.sidebar.querySelectorAll('div > button[data-group="wishlist"]').forEach( el_a => {
                    el_a.disabled = false;
                });
                */
                // Mostra i film all'avvio dell'applicazione
                //this.showUserSessionsTable(this.sessionManager.movies, userId);
                // Crea e mostra l'elenco delle categorie nella barra laterale, ognuno con un event listener
                //this.fillCategoriesMenu();
    }

    showUserSessionsTable(sessions, userId) {
        console.log('showUserSessionsTable');
        if (userId === this.userId) {
            getUser(this.userId).then((user)=>{
                document.getElementById("user-wishlist").innerText = `La tua lista dei desideri (${user.username})`
            });
        } else {
            const otherUserId = parseInt(this.currentPage.split('/')[1]);
            getUser(otherUserId).then((user)=>{
                document.getElementById("user-wishlist").innerText = `La lista dei desideri di ${user.username}`
            });
        }
        let sessionTable = this.sessionsContainer.querySelector("table > tbody");
        sessionTable.innerHTML = '';
        // controlla se la lista di film è definita e se contiene almeno un elemento
        if (sessions && sessions.length) {
            document.getElementById("session-list").classList.add("session-list");

            sessions.forEach((session) => {
                sessionTable.insertAdjacentHTML("beforeend", createUserSessionRow(session,this.currentPage)); // create table row with a js template
                
                if (userId === this.userId) {
                    // add behaviors to table row's controls 
                    sessionTable.querySelector(`input#done_${session.id}`).addEventListener('change',  (e) => {
                        this.onChangeDone(e, session);
                    });
                    document.getElementById(`dlt_${session.id}`).addEventListener('click', () => {
                        this.onClickRemove(session);
                    })
                } else if (!this.isAdmin) {
                    // add behaviors to table row's controls 
                    document.getElementById(`add_${session.id}`).addEventListener('click', () => {
                        this.onClickAdd(session);
                    })
                } else {
                    document.getElementById(`add_${session.id}`).remove();
                }
            });
        } else { 
            document.getElementById("session-list").classList.remove("session-list");
            sessionTable.innerHTML = noSessionDiv();
        }
    }

     // Metodo che restituisce un'icona pubblica (identifica i film pubblici)
    publicIcon () {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
        </svg>`
    }

    /**
     * Returns the HTML string for the delete icon.
     * @return {string} - The HTML string for the delete icon.
     */
    static dltIcon () {
        return `<img class="btn-icon p-1 rounded-5" src='./svg/dash-circle.svg' alt='cancella'>`
    }

    // Metodo per mostrare un messaggio se nessun film è disponibile
    static noSessionDiv() {
        return `<div class="alert alert-danger" role="alert">Nessuna sessione di allenamento da mostrare</div>`;
    }

    // Metodo per creare una riga (TR) per un film nella tabella
    createTR(session) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");

        td.innerHTML = `<span class="d-none" id="sessionId_${session.id}">${session.id}</span>`;
        tr.appendChild(td);

        // Creazione di un input checkbox con il titolo del film
        const checked = (session.done) ? "checked" : '';
        moment.locale('it');
        td.innerHTML = `<input class="form-check-input me-2" type="checkbox" value="" ${checked} id="done_${session.id}">
                        <label class="form-check-label" for="done_${session.id}">
                            ${session.date.format('LL')}
                        </label>`;
        td.querySelector("input").addEventListener('change', (e) => {
            this.onChangeDone(e,session);
        })
        tr.appendChild(td);

        // Aggiunta di un'icona se il film è imperdibile
        td = document.createElement("td");
        if (session.unmissable) {
            td.classList.add("text-danger");
            td.innerHTML = '!!!';
        };
        tr.appendChild(td);

        // Aggiunta delle categorie come badge bootstrap
        td = document.createElement("td");
        session.sector.forEach(sector => {
            let span = `<span class="badge rounded-pill bg-aqua">${sector}</span> `;
            td.insertAdjacentHTML('beforeend', span);
        });
        tr.appendChild(td);
/*
        // Aggiunta dell'icona pubblica se l'informazione che il film sia nella wishlist è visibile al pubblico
        td = document.createElement("td");
        if (movie.visibility == 'public') {
            td.innerHTML = this.publicIcon();
        }
        tr.appendChild(td);
*/
        // Aggiunta della data di scadenza se disponibile
        td = document.createElement("td");
        td.innerHTML = session.difficulty;
        tr.appendChild(td);

        // Aggiunta bottone per cancellazione film dalla wishlist
        td = document.createElement("td");
        td.innerHTML = `<a href="#" alt='remove session from list' title='remove session from list' id='dlt-${session.id}' data-bs-toggle="modal" data-bs-target="#dltSessionModal">
                            ${App.dltIcon()}
                        </a>`;
        td.querySelector("a").addEventListener('click', () => {
            this.setDeleteModal(session);
        })
        tr.appendChild(td);

        return tr;
    }

    /**
     * Handles the delete button click event on user's wishlist.
     * @param  {Object} movie - The movie to be removed from the wishlist.
     */
    onClickRemove = (session) => {
        setDeleteModal(session)
        .then(() => {
            this.showUserSessions(this.userId);
            this.triggerClickActiveFilter();
        })
        .catch((error) => { this.showErrorMsg(error) } );
    }

    /**
     * Handles the add button click event.
     * @param  {Object} movie - The movie to add in the wishlist.
     */
    onClickAdd = (movie) => {
        this.manageSessionModal
            .then(() => {
                page.redirect(`/${this.currentPage}`)
            })
            .catch((error) => { this.showErrorMsg(error) } );
    }

    //
    setDeleteModal(session){
        const dltButton = dltSessionModal.querySelector('#dlt-session');
        dltButton.addEventListener('click', () => {
            this.sessionManager.dltSessionFromList(this.userId, session);

            let filterType = this.sidebar.querySelector('a.active').dataset.id;
            let filter;
            let sessions=[];
            if(SessionManager.sectors.includes(filterType)) {
                filter = new Filter(this.sessionManager,'sector');
                sessions = filter.apply(filterType);
            }
            else {
                filter = new Filter(this.sessionManager,filterType);
                sessions = filter.apply();
            }
            
            this.showSessions(sessions);
        });
    }

    manageDltSessionModal(){
        const dltSessionModal = `<div class="modal fade" id="dltSessionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="dltSessionModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="newSessionModalLabel">Elimina sessione</h1>
                        <button type="button" class="btn-close" id="close-dltmodal" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3"> 
                            <p class="form-check-label">Sei sicuro di voler cancellare questa sessione di allenamento?</p>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="dlt-session">Si</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', dltSessionModal);
    }

    /**
     * Handles the change event for the viewed checkbox.
     * @param  {Event} event - The change event object.
     * @param  {Object} session - The movie object to update.
     */
    onChangeDone(event, session) {
        session.done = event.target.checked;
        this.sessionManager.updSessionInWishList(this.userId, session)
            .then()
            .catch(err => {throw err});
    }

    // Metodo che aggiunge un event listener per gestire il clic per ogni filtro nella barra laterale
    manageFilters() {
        this.sidebar.querySelectorAll('div > a').forEach( el_a => {
            el_a.addEventListener('click', e => {
                const el = e.target;

                // Ottieni il tipo di filtro dalla proprietà `data-id` dell'elemento
                const filterType = el.dataset.id;

                // Rimuovi la classe 'active' dal link attivo e aggiungila al link selezionato
                this.sidebar.querySelector('.active').classList.remove('active');
                el.classList.add('active');

                // Applica il filtro e ottieni i film filtrati
                let filter = new Filter(this.sessionManager, filterType);
                let sessions = filter.apply();

                // Aggiorna l'intestazione del filtro con il tipo selezionato
                let header = document.getElementById("filter-title");
                header.innerText = this.sidebar.querySelector("a.active").innerText;

                // Mostra i film filtrati
                this.showSessions(sessions);
            });
        });
    }

    initModals() {
        const addNewSession = (event) => {
            const form = newSessionModal.querySelector(".needs-validation");
            form.classList.add('was-validated');
            
            if (form.checkValidity()) {
                // Ottieni i valori dal form
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
                // Aggiungi la nuova sessione al gestore delle sessioni
                this.sessionManager.addSessionInList(this.userId, session);
                // Applica il filtro attuale e mostra i film aggiornati
                let filterType = this.sidebar.querySelector('a.active').dataset.id;
                let filter;
                let sessions=[];
                // Se il filtro è una categoria, l'oggetto Filter viene costruito e
                // applicato di conseguenza
                if(SessionManager.sectors.includes(filterType)) {
                    filter = new Filter(this.sessionManager,'sector');
                    sessions = filter.apply(filterType);
                }
                else {
                    filter = new Filter(this.sessionManager,filterType);
                    sessions = filter.apply();
                }
                console.log('show');
                this.showUserSessions(this.userId);

                // Crea nuovamente la lista delle categorie nella barra laterale sinistra,
                // dato che l'inserimento di un nuovo film potrebbe aver usato una nuova
                // categoria fino a quel momento non usata
                this.createSectorList();

                // Chiudi la finestra modale
                document.getElementById("close-modal").click();
            }
            // Aggiungi la classe 'was-validated' per mostrare gli errori di validazione Bootstrap
            form.classList.add('was-validated');
        }
        const newSessionModal = document.getElementById("newSessionModal");
        const cleanModal = document.getElementById("confirmModal");

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

        //TODO manca il dlt modal
        /*
        const confirmBtn = cleanModal.querySelector("#confirm-btn");
        confirmBtn.addEventListener("click", event => {
            this.onClickCleaning(cleanModal);
        });
        */
    }
/*
    manageSessionModal() {
        //this.createSectorList();
        const newSessionModal = document.getElementById('newSessionModal');

        newSessionModal.addEventListener('show.bs.modal', event => {
            newSessionModal.querySelector("form").reset();
        });
        // Popola il menu a tendina delle categorie nella finestra modale
        // Qui vengono proposte tutte le categorie, anche quelle non rappresentate dai film
        // attualmente presenti nel sessionManager
        SessionManager.sectors.forEach(sec => {
            let option = document.createElement('option');
            option.setAttribute('value', sec);
            option.innerText = sec;
            newSessionModal.querySelector("#session-sector").appendChild(option);
        });

        // aggiungi Event listener per gestire l'invio  del form
        const form = newSessionModal.querySelector('.needs-validation');
        form.addEventListener('submit', event => {
            // evita che il submit venga inoltrato alla pagina, cosa che potrebbe causare il reload della stessa
            event.preventDefault();
            event.stopPropagation();
            // Se il form è stato validato correttamente, procede con l'inserimento del film
            if (form.checkValidity()) {
                // Ottieni i valori dal form
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
                // Aggiungi il nuovo film al gestore dei film
                this.sessionManager.addSessionInList(this.userId, session);
                // Applica il filtro attuale e mostra i film aggiornati
                let filterType = this.sidebar.querySelector('a.active').dataset.id;
                let filter;
                let sessions=[];
                // Se il filtro è una categoria, l'oggetto Filter viene costruito e
                // applicato di conseguenza
                if(SessionManager.sectors.includes(filterType)) {
                    filter = new Filter(this.sessionManager,'sector');
                    sessions = filter.apply(filterType);
                }
                else {
                    filter = new Filter(this.sessionManager,filterType);
                    sessions = filter.apply();
                }
                console.log('show');
                this.showSessions(sessions);

                // Crea nuovamente la lista delle categorie nella barra laterale sinistra,
                // dato che l'inserimento di un nuovo film potrebbe aver usato una nuova
                // categoria fino a quel momento non usata
                this.createSectorList();

                // Chiudi la finestra modale
                document.getElementById("close-modal").click();
            }
            // Aggiungi la classe 'was-validated' per mostrare gli errori di validazione Bootstrap
            form.classList.add('was-validated');
        });
    }
*/
    // Metodo per creare e mostrare l'elenco delle categorie nella barra laterale
    createSectorList() {
        let dd_menu = this.sidebar.querySelector(".dropdown-menu");
        dd_menu.innerHTML = `<li><a class="dropdown-item active" data-id="all-sectors" href="#">Tutti</a></li>`;

        let sectors = this.sessionManager.getSectors();

        sectors.forEach(sector => {
            dd_menu.insertAdjacentHTML('beforeend',
                `<li><a class="dropdown-item" data-id="${sector}" href="#">${sector}</a></li>`);
        });

        // Aggiungi un event listener per gestire il clic per ogni categoria nella barra laterale (dropdown menu)
        this.createFiltersByCategory();
    }
    
     // Metodo che aggiunge un event listener per gestire il clic per ogni categoria nella barra laterale (dropdown menu)   
    createFiltersByCategory() {
        this.sidebar.querySelectorAll('.dropdown-menu a').forEach ( cat => {
            cat.addEventListener('click', e => {
                const el = e.target;

                // Ottieni la categoria dalla proprietà `data-id` dell'elemento
                const sector = el.dataset.id;

                // Rimuovi la classe 'active' dal link attivo del menù principale
                this.sidebar.querySelectorAll('.active').forEach(
                    el => el.classList.remove('active')
                );

                // Aggiunge la classe active alla voce "Categorie" del menù princiapale ed 
                // anche alla categoria cliccata
                document.getElementById("sector").classList.add('active');
                el.classList.add('active');

                // Applica il filtro per categoria e ottieni i film filtrati
                let filter = new Filter(this.sessionManager, 'sector');
                let sessions = filter.apply(sector);

                // Aggiorna l'intestazione del filtro con la categoria selezionata
                let header = document.getElementById("filter-title");
                header.innerText = `Settore: ${el.innerText}`;

                // Mostra i film filtrati
                this.showSessions(sessions);

                // Aggiorna lo stato della categoria attiva nella barra laterale
                this.updateActiveCategory(sector);
            });
        });
    }

    // Metodo per aggiornare la categoria attiva nella barra laterale
    updateActiveCategory(filterCat) {
        let dd_menu = this.sidebar.querySelector(".dropdown-menu");
        dd_menu.querySelector('a.active').classList.remove('active');
        dd_menu.querySelector(`a[data-id="${filterCat}"`).classList.add('active');
    }

}

export default App;