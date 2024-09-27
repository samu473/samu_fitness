"use strict";

import {sectorButton} from "./sectorController.js";
import {Sector} from "./sector.js"

class sectorController{
    constructor(){
        this.g = new Guest();
    }

    initGuestPage(user) {

        this.mainContainer.innerHTML = createMainContainer();
        this.sectorContainer = document.getElementById("sector-list");

        this.sidebar = document.getElementById("sidebar-list");
        this.sidebar.innderHTML = '';
        
        this.s = new Sector();
        
    }
}
/*
"use strict";

class Sector{
    static names = ['Gambe', 'Schiena', 'Addominali', 'Glutei', 'Petto', 'Bicipiti', 'Spalle', 'Cardio', 'Stretching'];
    getSvg(gender){
        switch(gender){
            case 'm':
                return {
                    'Gambe' : './svg/gamba.svg',
                    'Schiena' : './svg/schiena.svg',
                    'Glutei' : './svg/f-glutei.svg',
                    'Petto' : './svg/m-petto.svg',
                    'Addominali' : './svg/m-addominali.svg',
                    'Bicipi' : './svg/braccio.svg',
                    'Spalle' : './svg/spalle.svg',
                    'Cardio' : './svg/m-stretching.svg',
                    'Stretching' : './svg/m-stretching.svg'
                };
            case 'f':
                return {
                    'Gambe' : './svg/gamba.svg',
                    'Schiena' : './svg/schiena.svg',
                    'Glutei' : './svg/f-glutei.svg',
                    'Petto' : './svg/f-petto.svg',
                    'Addominali' : './svg/f-addominali.svg',
                    'Bicipi' : './svg/braccio.svg',
                    'Spalle' : './svg/spalle.svg',
                    'Cardio' : './svg/f-stretching.svg',
                    'Stretching' : './svg/f-stretching.svg'
                };
        }
    }
}

export {Sector};
*/