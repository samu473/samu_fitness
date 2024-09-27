const page = require('page');
const { caricaPaginaSessioni, caricaPaginaSessioniUtente } = require('./session.js');
const { caricaPaginaPrincipale } = require('./main.js');

page('/', caricaPaginaPrincipale);
page('/sessions', caricaPaginaSessioni);
page('/users/:userId/sessions', caricaPaginaSessioniUtente);

page.start();