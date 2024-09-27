"use strict";
import { createAdminButtons } from "./adminbuttons-template.js";

function createMainContainer()  {
    return `<aside class = "collapse d-sm-block col-sm-4 col-12 bg-light p-3" id = "left-sidebar">
				<div class="list-group list-group-flush border">
					<a href="#" data-id="all" class="list-group-item list-group-item-action active" aria-current="true">Tutti</a>
					<a href="#" data-id="unmissable" class="list-group-item list-group-item-action">Imperdibili</a>
					<a href="#" data-id="today" class="list-group-item list-group-item-action">Allenamento di oggi</a>
					<a href="#" data-id="week" class="list-group-item list-group-item-action">Allenamenti della settimana</a>
					<a href="#" data-id="done" class="list-group-item list-group-item-action">Svolti</a>
					<a href="#" data-id="undone" class="list-group-item list-group-item-action">Inconclusi</a>
				</div>
				<div class="list-group list-group-flush border mt-2">
					<span id="category" class="list-group-item dropdown">
					  	<div class="dropdown">
							<span class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
						  		Settori
							</span>
							<ul class="dropdown-menu">
						  		<!-- le varie voci (categorie) sono inserite da JS -->
							</ul>
					  	</div> 
					</span>
				</div>
			</aside>

			<div class = "col-sm-8 col-12">
				<h1 id="filter-title">Tutti</h1>
				<div id = "session-container">
					<div class="table-responsive rounded-3" id="session-list">
						<table class="table table-striped m-0">
							<tbody>
						  	</tbody>
						</table>
					</div>
				</div>
				<div class="text-end mt-2"> 
					<button type="button" id="new-session-btn" class="btn btn-success text-end rounded-5 bg-aqua" data-bs-toggle="modal" data-bs-target="#newSessionModal">&#43;</button>
				</div>
			</div>`;
}

export {createMainContainer}