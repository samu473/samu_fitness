function createAlert(type, message) {
    return `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <span>${message}</span> 
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
  }
  
  export {createAlert};