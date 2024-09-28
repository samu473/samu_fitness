"use strict";

import { dltIcon, unmissableIcon } from "./icons-template.js";

function createTR(session) {
    const tr = document.createElement('tr');

    tr.addEventListener('click', () => {
        console.log('Sessione cliccata');
    });

    const tdId = document.createElement('td');
    const spanId = document.createElement('span');
    spanId.className = 'd-none';
    spanId.id = `sessionId_${session.id}`;
    spanId.textContent = session.id;
    tdId.appendChild(spanId);

    const tdDate = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.className = 'form-check-input me-2';
    checkbox.type = 'checkbox';
    checkbox.id = `done-${session.id}`;
    checkbox.checked = session.done;

    const label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = `done-${session.id}`;
    label.textContent = session.date.format('LL');

    tdDate.appendChild(checkbox);
    tdDate.appendChild(label);

    const tdUnmissable = document.createElement('td');
    if (session.unmissable) {
        tdUnmissable.appendChild(unmissableIcon());
    }

    const tdSectors = document.createElement('td');
    session.sector.forEach(sector => {
        const spanSector = document.createElement('span');
        spanSector.className = 'badge rounded-pill bg-aqua';
        spanSector.textContent = sector;
        tdSectors.appendChild(spanSector);
    });

    const tdDifficulty = document.createElement('td');
    tdDifficulty.textContent = session.difficulty;

    const tdDelete = document.createElement('td');
    const deleteLink = document.createElement('a');
    deleteLink.className = 'cursor-pointer';
    deleteLink.title = 'remove session from list';
    deleteLink.id = `dlt-${session.id}`;
    deleteLink.setAttribute('data-bs-toggle', 'modal');
    deleteLink.setAttribute('data-bs-target', '#dltSessionModal');
    deleteLink.appendChild(dltIcon());
    tdDelete.appendChild(deleteLink);

    tdDelete.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log('Tasto di cancellazione cliccato');
    });

    tr.appendChild(tdId);
    tr.appendChild(tdDate);
    tr.appendChild(tdUnmissable);
    tr.appendChild(tdSectors);
    tr.appendChild(tdDifficulty);
    tr.appendChild(tdDelete);

    return tr;
}

export { createTR };