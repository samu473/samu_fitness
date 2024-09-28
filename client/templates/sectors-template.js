"use strict";

function createSectorsDropdown(sectors) {
    let dropdown = document.createElement('li');
    let allSectorsLink = document.createElement('a');
    allSectorsLink.className = 'dropdown-item active';
    allSectorsLink.setAttribute('data-id', 'all-sectors');
    allSectorsLink.textContent = 'Tutti';
    dropdown.appendChild(allSectorsLink);

    sectors.forEach(sector => {
        dropdown.appendChild(createSectorItem(sector));
    });

    return dropdown;
}

function createSectorItem(filter) {
    let li = document.createElement('li');
    let link = document.createElement('a');
    link.className = 'dropdown-item';
    link.setAttribute('data-id', filter);
    link.textContent = filter;
    li.appendChild(link);
    return li;
}

export { createSectorsDropdown };