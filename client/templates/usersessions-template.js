"use strict";

//import { addIcon, unmIcon, mssIcon, pubIcon, prvIcon, dltIcon } from "./icons-template.js";
//import { createCategorySpans } from "./categories-template.js";

    /**
     * Creates a table row given a movie in the wishlist
     * @param  {String} movieObj - The movie object to display.
     */
function createUserSessionRow(session, currentPage) {
    if (currentPage === 'mysessions') {
        const checked = (movieObj.viewed) ? "checked" : '';
        let htmlString = `
            <tr>
                <td>
                    <span class="d-none" id="sessionId_${session.id}">${session.id}</span>
                </td>
                <td>
                    <input class="form-check-input me-2" type="checkbox" value="" ${session.done ? 'checked' : ''} id="done_${session.id}">
                    <label class="form-check-label" for="done_${session.id}">
                        ${session.date.format('LL')}
                    </label>
                </td>
                <td class="${session.unmissable ? 'text-danger' : ''}">
                    ${session.unmissable ? '!!!' : ''}
                </td>
                <td>
                    ${session.sector.map(sector => `<span class="badge rounded-pill bg-aqua">${sector}</span>`).join(' ')}
                </td>
                <td>
                    ${session.difficulty}
                </td>
                <td>
                    <a href="#" alt='remove session from list' title='remove session from list' id='dlt-${session.id}' data-bs-toggle="modal" data-bs-target="#dltSessionModal">
                        ${App.dltIcon()}
                    </a>
                </td>
            </tr>
            `;
    }
    return htmlString;
}

export { createUserSessionRow };