function checkUserStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
}

window.addEventListener('load', checkUserStatus);
