"use strict";

import App from "./app.js";

const mainContainer = document.querySelector("main");
const navbar = document.querySelector("#navbar")

const app = new App(navbar, mainContainer);