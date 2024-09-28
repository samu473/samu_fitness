"use strict";

function createMainContainer() {
    const aside = document.createElement('aside');
    aside.className = 'collapse d-sm-block col-sm-4 col-12 bg-light p-3';
    aside.id = 'left-sidebar';

    const listGroup = document.createElement('div');
    listGroup.className = 'list-group list-group-flush border';

    const items = [
        { id: 'all', text: 'Tutti', active: true },
        { id: 'unmissable', text: 'Imperdibili' },
        { id: 'today', text: 'Allenamento di oggi' },
        { id: 'week', text: 'Allenamenti della settimana' },
        { id: 'done', text: 'Svolti' },
        { id: 'undone', text: 'Inconclusi' }
    ];

    items.forEach(item => {
        const link = document.createElement('a');
        link.className = 'list-group-item list-group-item-action';
        link.setAttribute('data-id', item.id);
        if (item.active) link.classList.add('active');
        link.textContent = item.text;
        listGroup.appendChild(link);
    });

    aside.appendChild(listGroup);

    const categoryGroup = document.createElement('div');
    categoryGroup.className = 'list-group list-group-flush border mt-2';

    const categorySpan = document.createElement('span');
    categorySpan.id = 'sector';
    categorySpan.className = 'list-group-item dropdown';

    const dropdownDiv = document.createElement('div');
    dropdownDiv.className = 'dropdown';

    const dropdownToggle = document.createElement('span');
    dropdownToggle.className = 'dropdown-toggle';
    dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownToggle.textContent = 'Settori';

    const dropdownMenu = document.createElement('ul');
    dropdownMenu.className = 'dropdown-menu';

    dropdownDiv.appendChild(dropdownToggle);
    dropdownDiv.appendChild(dropdownMenu);

    categorySpan.appendChild(dropdownDiv);
    categoryGroup.appendChild(categorySpan);

    aside.appendChild(categoryGroup);

    const mainCol = document.createElement('div');
    mainCol.className = 'col-sm-8 col-12';

    const titleH1 = document.createElement('h1');
    titleH1.id = 'table-title';
    titleH1.className = 'bg-rottentomatoes p-2';

    const filterH3 = document.createElement('h3');
    filterH3.id = 'filter-title';
    filterH3.textContent = 'Tutti';

    const sessionContainer = document.createElement('div');
    sessionContainer.id = 'session-container';

    const tableResponsive = document.createElement('div');
    tableResponsive.className = 'table-responsive rounded-3';
    tableResponsive.id = 'session-list';

    const table = document.createElement('table');
    table.className = 'table table-striped m-0';

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    tableResponsive.appendChild(table);
    sessionContainer.appendChild(tableResponsive);

    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'd-flex justify-content-end mt-3';

    const newSessionBtn = document.createElement('button');
    newSessionBtn.type = 'button';
    newSessionBtn.id = 'new-session-btn';
    newSessionBtn.className = 'btn btn-primary bg-aqua btn-lg rounded-pill';
    newSessionBtn.setAttribute('data-bs-toggle', 'modal');
    newSessionBtn.setAttribute('data-bs-target', '#newSessionModal');
    newSessionBtn.textContent = '+ Aggiungi Sessione';

    buttonDiv.appendChild(newSessionBtn);
    sessionContainer.appendChild(buttonDiv);

    mainCol.appendChild(titleH1);
    mainCol.appendChild(filterH3);
    mainCol.appendChild(sessionContainer);

    return [aside, mainCol];
}

export { createMainContainer };