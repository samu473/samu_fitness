"use strict";

function createProfilePage() {
    const divContainer = document.createElement('div');
    divContainer.className = 'container mt-5';

    const nameHeading = document.createElement('h1');
    nameHeading.id = 'profTitle';
    nameHeading.className = 'display-4 text-center';

    const toggleDiv = document.createElement('div');
    toggleDiv.className = 'd-flex justify-content-center mt-4';

    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleProfile';
    toggleButton.className = 'btn';

    toggleButton.addEventListener('click', function() {
        if (toggleButton.classList.contains('btn-outline-primary')) {
            toggleButton.classList.remove('btn-outline-primary');
            toggleButton.classList.add('btn-outline-danger');
            toggleButton.textContent = 'Profilo Privato';
        } else {
            toggleButton.classList.remove('btn-outline-danger');
            toggleButton.classList.add('btn-outline-primary');
            toggleButton.textContent = 'Profilo Pubblico';
        }
    });

    toggleDiv.appendChild(toggleButton);
    divContainer.appendChild(nameHeading);
    divContainer.appendChild(toggleDiv);

    const statsHeading = document.createElement('h2');
    statsHeading.className = 'text-center mt-5';
    statsHeading.textContent = 'Statistiche';

    const statsList = document.createElement('ul');
    statsList.className = 'list-group mt-3';
    
    const statsItems = [
        { text: 'Totale sessioni pianificate:', id: 'totaleSessioniPianificate' },
        { text: 'Totale sessioni svolte:', id: 'totaleSessioniSvolte' },
        { text: 'Percentuale di sessioni svolte:', id: 'percentualeSessioniSvolte' },
        { text: 'Sessioni imperdibili non svolte:', id: 'sessioniImperdibiliNonSvolte' }
    ];
    statsItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        
        const itemText = document.createElement('span');
        itemText.textContent = item.text;
        
        const valueContainer = document.createElement('span');
        valueContainer.id = item.id;
        valueContainer.className = 'float-end';
        if (item.id === 'percentualeSessioniSvolte') {
            const percentageValue = document.createElement('span');
            percentageValue.id = 'valorePercSessioniSvolte';
            valueContainer.appendChild(percentageValue);
            
            const percentageSymbol = document.createElement('span');
            percentageSymbol.innerHTML = '%';
            valueContainer.appendChild(percentageSymbol);
        }
        listItem.appendChild(itemText);
        listItem.appendChild(valueContainer);
        statsList.appendChild(listItem);
    });

    divContainer.appendChild(statsHeading);
    divContainer.appendChild(statsList);
    return divContainer;
}

export { createProfilePage };