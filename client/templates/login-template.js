
function createLoginForm() {
return `<form method="POST" action="" id="login-form" class="col-6 mx-auto mt-2">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" required autocomplete="username">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required  autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn-outline-success">Submit</button>
        </form>`;
}
export {createLoginForm};