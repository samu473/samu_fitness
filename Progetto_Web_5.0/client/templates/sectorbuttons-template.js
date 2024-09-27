"use strict";

function sectorButton(name, svg){
    return (`<button id = "sector-button"><img height="105px" width="105px" src = "${svg}"/>${name}</button>`);
}

export {sectorButton};