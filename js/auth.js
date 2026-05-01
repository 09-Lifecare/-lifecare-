const demoAccounts = [
    { email: 'sarah@lifecare.com', password: 'password123', name: 'Sarah Johnson', role: 'Nursing Student' },
    { email: 'john@lifecare.com', password: 'password123', name: 'John Smith', role: 'Student' },
    { email: 'teacher@lifecare.com', password: 'password123', name: 'Dr. Emily', role: 'Teacher' }
];

window.addEventListener('DOMContentLoaded', function() {
    updateUserDisplay();
});

function updateUserDisplay() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const userInfo = document.getElementById('user-info');
    const loginLink = document.getElementById('login-link');
    const logoutBtn = document.getElementById('logout-btn');

    if (user && userInfo) {
        userInfo.textContent = user.name + ' (' + user.role + ')';
        if (loginLink) loginLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        if (userInfo) userInfo.textContent = '';
        if (loginLink) loginLink.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    const user = demoAccounts.find(u => u.email === email && u.password === password);

    if (user) {
        const userData = {
            id: Date.now(),
            name: user.name,
            email: email,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        window.location.href = '../pages/dashboard.html';
    } else {
        showError('Invalid credentials. Use demo: sarah@lifecare.com / password123');
    }
}

function signup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const role = document.getElementById('signup-role').value;

    if (!name || !email || !password || !role) {
        showError('Please fill in all fields');
        return;
    }

    if (demoAccounts.find(u => u.email === email)) {
        showError('Email already registered');
        return;
    }

    const userData = {
        id: Date.now(),
        name: name,
        email: email,
        role: role,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    window.location.href = '../pages/dashboard.html';
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tasks');
    localStorage.removeItem('health');
    localStorage.removeItem('expenses');
    localStorage.removeItem('duties');
    localStorage.removeItem('calendar');
    window.location.href = '../index.html';
}

function toggleAuth() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

function showError(message) {
    alert(message);
}
