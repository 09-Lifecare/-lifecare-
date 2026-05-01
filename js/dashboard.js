window.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        window.location.href = '../pages/login.html';
        return;
    }

    initializeUserData();
    loadDashboard();
    updateUserDisplay();
});

function updateUserDisplay() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        document.getElementById('user-display').textContent = user.name + ' (' + user.role + ')';
    }
}

function initializeUserData() {
    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', JSON.stringify([]));
    }
    if (!localStorage.getItem('health')) {
        localStorage.setItem('health', JSON.stringify([]));
    }
    if (!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify([]));
    }
    if (!localStorage.getItem('duties')) {
        localStorage.setItem('duties', JSON.stringify([]));
    }
    if (!localStorage.getItem('budget')) {
        localStorage.setItem('budget', JSON.stringify({ limit: 5000, allowance: 0 }));
    }
}

function loadDashboard() {
    showSection('dashboard');
    setActiveSidebar('dashboard-link');
}

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.add('hidden');
    });

    const element = document.getElementById(section);
    if (element) {
        element.classList.remove('hidden');

        if (section === 'dashboard') loadOverview();
        else if (section === 'health') loadHealth();
        else if (section === 'tasks') loadTasks();
        else if (section === 'expenses') loadExpenses();
        else if (section === 'duties') loadDuties();
        else if (section === 'calendar') loadCalendar();
        else if (section === 'profile') loadProfile();
    }
}

function setActiveSidebar(id) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

function loadOverview() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const health = JSON.parse(localStorage.getItem('health')) || [];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const duties = JSON.parse(localStorage.getItem('duties')) || [];
    const budget = JSON.parse(localStorage.getItem('budget')) || { limit: 5000, allowance: 0 };

    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const remaining = budget.limit - totalExpenses;

    const html = `
        <div class="overview-grid">
            <div class="overview-card">
                <h4>Total Tasks</h4>
                <div class="value">${tasks.length}</div>
            </div>
            <div class="overview-card">
                <h4>Completed Tasks</h4>
                <div class="value">${tasks.filter(t => t.completed).length}</div>
            </div>
            <div class="overview-card">
                <h4>Total Expenses</h4>
                <div class="value">₱${totalExpenses.toFixed(2)}</div>
            </div>
            <div class="overview-card">
                <h4>Budget Remaining</h4>
                <div class="value">₱${Math.max(0, remaining).toFixed(2)}</div>
            </div>
            <div class="overview-card">
                <h4>Health Records</h4>
                <div class="value">${health.length}</div>
            </div>
            <div class="overview-card">
                <h4>Scheduled Duties</h4>
                <div class="value">${duties.length}</div>
            </div>
        </div>
    `;

    document.getElementById('overview-content').innerHTML = html;
}

function loadHealth() {
    const health = JSON.parse(localStorage.getItem('health')) || [];

    let html = `
        <div class="form-group">
            <label>Medical Condition</label>
            <input type="text" id="health-condition" placeholder="Enter condition or symptoms">
        </div>
        <div class="form-group">
            <label>Medications</label>
            <input type="text" id="health-medications" placeholder="Current medications">
        </div>
        <div class="form-group">
            <label>Allergies</label>
            <input type="text" id="health-allergies" placeholder="Known allergies">
        </div>
        <div class="form-group">
            <label>Doctor's Orders</label>
            <textarea id="health-orders" placeholder="Any doctor's orders or notes" style="resize: vertical; min-height: 80px;"></textarea>
        </div>
        <div class="form-group">
            <button onclick="addHealthRecord()" class="btn-primary">Save Health Record</button>
        </div>
        <h3 style="margin-top: 2rem;">Health Records</h3>
        <div id="health-list">
    `;

    health.forEach((record, index) => {
        html += `
            <div class="health-item">
                <div class="health-item-info">
                    <div class="health-label">${record.condition}</div>
                    <div class="health-meta">Medications: ${record.medications}</div>
                    <div class="health-meta">Allergies: ${record.allergies}</div>
                    <div class="health-meta">Date: ${record.date}</div>
                </div>
                <button onclick="deleteHealthRecord(${index})" class="btn-delete">Delete</button>
            </div>
        `;
    });

    html += '</div>';
    document.getElementById('health-content').innerHTML = html;
}

function addHealthRecord() {
    const condition = document.getElementById('health-condition').value.trim();
    const medications = document.getElementById('health-medications').value.trim();
    const allergies = document.getElementById('health-allergies').value.trim();
    const orders = document.getElementById('health-orders').value.trim();

    if (!condition) {
        alert('Please enter a medical condition');
        return;
    }

    const health = JSON.parse(localStorage.getItem('health')) || [];
    health.push({
        condition: condition,
        medications: medications || 'None',
        allergies: allergies || 'None',
        orders: orders || 'None',
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem('health', JSON.stringify(health));
    loadHealth();
}

function deleteHealthRecord(index) {
    const health = JSON.parse(localStorage.getItem('health')) || [];
    health.splice(index, 1);
    localStorage.setItem('health', JSON.stringify(health));
    loadHealth();
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    let html = `
        <div class="form-group">
            <label>Task Description</label>
            <input type="text" id="task-input" placeholder="Enter task">
        </div>
        <div class="form-group">
            <label>Due Date</label>
            <input type="date" id="task-date">
        </div>
        <div class="form-group">
            <button onclick="addTask()" class="btn-primary">Add Task</button>
        </div>
        <h3 style="margin-top: 2rem;">Your Tasks</h3>
        <div id="task-list">
    `;

    tasks.forEach((task, index) => {
        const checked = task.completed ? 'checked' : '';
        html += `
            <div class="task-item">
                <div class="task-item-info">
                    <input type="checkbox" ${checked} onchange="toggleTask(${index})">
                    <span class="task-name" style="margin-left: 0.75rem;">${task.description}</span>
                    <div class="task-meta">Due: ${task.dueDate}</div>
                </div>
                <button onclick="deleteTask(${index})" class="btn-delete">Delete</button>
            </div>
        `;
    });

    html += '</div>';
    document.getElementById('tasks-content').innerHTML = html;
}

function addTask() {
    const description = document.getElementById('task-input').value.trim();
    const dueDate = document.getElementById('task-date').value;

    if (!description) {
        alert('Please enter a task');
        return;
    }

    if (!dueDate) {
        alert('Please select a due date');
        return;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({
        description: description,
        dueDate: new Date(dueDate).toLocaleDateString(),
        completed: false
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('task-input').value = '';
    document.getElementById('task-date').value = '';
    loadTasks();
}

function toggleTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const budget = JSON.parse(localStorage.getItem('budget')) || { limit: 5000, allowance: 0 };

    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const remaining = budget.limit - totalExpenses;

    let html = `
        <div style="background-color: #F0F8FF; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-light-gray); font-weight: 500;">Budget Limit</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue);">₱${budget.limit.toFixed(2)}</div>
                </div>
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-light-gray); font-weight: 500;">Total Spent</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue);">₱${totalExpenses.toFixed(2)}</div>
                </div>
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-light-gray); font-weight: 500;">Remaining</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: ${remaining < 0 ? '#E74C3C' : '#27AE60'};">₱${Math.max(0, remaining).toFixed(2)}</div>
                </div>
            </div>
        </div>

        <h3>Set Budget</h3>
        <div class="form-group">
            <label>Budget Limit (Monthly)</label>
            <input type="number" id="budget-limit" value="${budget.limit}" placeholder="Enter budget limit">
        </div>
        <div class="form-group">
            <label>Allowance</label>
            <input type="number" id="budget-allowance" value="${budget.allowance}" placeholder="Enter allowance">
        </div>
        <div class="form-group">
            <button onclick="setBudget()" class="btn-primary">Update Budget</button>
        </div>

        <h3 style="margin-top: 2rem;">Add Expense</h3>
        <div class="form-group">
            <label>Amount</label>
            <input type="number" id="expense-amount" placeholder="0.00" step="0.01">
        </div>
        <div class="form-group">
            <label>Category</label>
            <select id="expense-category">
                <option>Food</option>
                <option>Transportation</option>
                <option>Medicine</option>
                <option>Books</option>
                <option>Utilities</option>
                <option>Other</option>
            </select>
        </div>
        <div class="form-group">
            <label>Description</label>
            <input type="text" id="expense-description" placeholder="Optional description">
        </div>
        <div class="form-group">
            <button onclick="addExpense()" class="btn-primary">Add Expense</button>
        </div>

        <h3 style="margin-top: 2rem;">Expense History</h3>
        <div id="expense-list">
    `;

    expenses.forEach((expense, index) => {
        html += `
            <div class="expense-item">
                <div class="expense-item-info">
                    <div class="expense-label">₱${parseFloat(expense.amount).toFixed(2)} - ${expense.category}</div>
                    <div class="expense-meta">${expense.description || 'No description'}</div>
                    <div class="expense-meta">Date: ${expense.date}</div>
                </div>
                <button onclick="deleteExpense(${index})" class="btn-delete">Delete</button>
            </div>
        `;
    });

    html += '</div>';
    document.getElementById('expenses-content').innerHTML = html;
}

function setBudget() {
    const limit = parseFloat(document.getElementById('budget-limit').value);
    const allowance = parseFloat(document.getElementById('budget-allowance').value);

    if (isNaN(limit) || limit <= 0) {
        alert('Please enter a valid budget limit');
        return;
    }

    localStorage.setItem('budget', JSON.stringify({ limit: limit, allowance: allowance }));
    loadExpenses();
}

function addExpense() {
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const description = document.getElementById('expense-description').value.trim();

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({
        amount: amount,
        category: category,
        description: description,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem('expenses', JSON.stringify(expenses));
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-description').value = '';
    loadExpenses();
}

function deleteExpense(index) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    loadExpenses();
}

function loadDuties() {
    const duties = JSON.parse(localStorage.getItem('duties')) || [];

    let html = `
        <h3>Schedule Duty</h3>
        <div class="form-group">
            <label>Duty Date</label>
            <input type="date" id="duty-date">
        </div>
        <div class="form-group">
            <label>Start Time</label>
            <input type="time" id="duty-start">
        </div>
        <div class="form-group">
            <label>End Time</label>
            <input type="time" id="duty-end">
        </div>
        <div class="form-group">
            <label>Location/Ward</label>
            <input type="text" id="duty-location" placeholder="Ward A, ICU, etc.">
        </div>
        <div class="form-group">
            <label>Materials Needed</label>
            <textarea id="duty-materials" placeholder="List materials needed for this duty" style="resize: vertical; min-height: 80px;"></textarea>
        </div>
        <div class="form-group">
            <label>Preparation Notes</label>
            <textarea id="duty-prep" placeholder="Mental, emotional, academic preparation notes" style="resize: vertical; min-height: 80px;"></textarea>
        </div>
        <div class="form-group">
            <button onclick="addDuty()" class="btn-primary">Schedule Duty</button>
        </div>

        <h3 style="margin-top: 2rem;">Scheduled Duties</h3>
        <div id="duty-list">
    `;

    duties.forEach((duty, index) => {
        html += `
            <div class="duty-item">
                <div class="duty-item-info">
                    <div class="duty-label">${duty.date} - ${duty.location}</div>
                    <div class="duty-meta">${duty.startTime} to ${duty.endTime}</div>
                    <div class="duty-meta">Materials: ${duty.materials}</div>
                    <div class="duty-meta">Preparation: ${duty.prep}</div>
                </div>
                <button onclick="deleteDuty(${index})" class="btn-delete">Delete</button>
            </div>
        `;
    });

    html += '</div>';
    document.getElementById('duties-content').innerHTML = html;
}

function addDuty() {
    const date = document.getElementById('duty-date').value;
    const startTime = document.getElementById('duty-start').value;
    const endTime = document.getElementById('duty-end').value;
    const location = document.getElementById('duty-location').value.trim();
    const materials = document.getElementById('duty-materials').value.trim();
    const prep = document.getElementById('duty-prep').value.trim();

    if (!date || !startTime || !endTime || !location) {
        alert('Please fill in all required fields');
        return;
    }

    const duties = JSON.parse(localStorage.getItem('duties')) || [];
    duties.push({
        date: new Date(date).toLocaleDateString(),
        startTime: startTime,
        endTime: endTime,
        location: location,
        materials: materials || 'None specified',
        prep: prep || 'None specified'
    });

    localStorage.setItem('duties', JSON.stringify(duties));
    document.getElementById('duty-date').value = '';
    document.getElementById('duty-start').value = '';
    document.getElementById('duty-end').value = '';
    document.getElementById('duty-location').value = '';
    document.getElementById('duty-materials').value = '';
    document.getElementById('duty-prep').value = '';
    loadDuties();
}

function deleteDuty(index) {
    const duties = JSON.parse(localStorage.getItem('duties')) || [];
    duties.splice(index, 1);
    localStorage.setItem('duties', JSON.stringify(duties));
    loadDuties();
}

function loadCalendar() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const duties = JSON.parse(localStorage.getItem('duties')) || [];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

    let html = `
        <h3>${monthName} ${currentYear}</h3>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--card-light-gray);">
                        <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Sun</th>
                        <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Mon</th>
                        <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Tue</th>
                        <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Wed</th>
                        <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Thu</th>
                        <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Fri</th>
                        <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Sat</th>
                    </tr>
                </thead>
                <tbody>
    `;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let dayCounter = 1;
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                html += '<td style="padding: 0.75rem; border: 1px solid var(--border-color); background-color: #FAFBFC;"></td>';
            } else if (dayCounter <= daysInMonth) {
                const dateStr = new Date(currentYear, currentMonth, dayCounter).toLocaleDateString();
                const tasksOnDay = tasks.filter(t => t.dueDate === dateStr).length;
                const dutiesOnDay = duties.filter(d => d.date === dateStr).length;
                const events = tasksOnDay + dutiesOnDay;

                html += `<td style="padding: 0.75rem; border: 1px solid var(--border-color); vertical-align: top; background-color: ${events > 0 ? '#E3F2FD' : 'white'};">
                    <strong>${dayCounter}</strong>
                    ${events > 0 ? '<div style="font-size: 0.75rem; color: var(--primary-blue); margin-top: 0.25rem;">' + events + ' event(s)</div>' : ''}
                </td>`;
                dayCounter++;
            } else {
                html += '<td style="padding: 0.75rem; border: 1px solid var(--border-color); background-color: #FAFBFC;"></td>';
            }
        }
        html += '</tr>';
        if (dayCounter > daysInMonth) break;
    }

    html += `
                </tbody>
            </table>
        </div>

        <h3>Upcoming Events</h3>
        <div>
    `;

    const allEvents = [];
    tasks.forEach(task => {
        allEvents.push({ type: 'Task', description: task.description, date: task.dueDate });
    });
    duties.forEach(duty => {
        allEvents.push({ type: 'Duty', description: duty.location, date: duty.date, time: duty.startTime });
    });

    allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (allEvents.length === 0) {
        html += '<p style="color: var(--text-light-gray);">No upcoming events</p>';
    } else {
        allEvents.slice(0, 10).forEach(event => {
            html += `
                <div class="task-item">
                    <div class="task-item-info">
                        <div class="task-name">${event.type}: ${event.description}</div>
                        <div class="task-meta">Date: ${event.date} ${event.time ? 'at ' + event.time : ''}</div>
                    </div>
                </div>
            `;
        });
    }

    html += '</div>';
    document.getElementById('calendar-content').innerHTML = html;
}

function loadProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const html = `
        <div class="profile-section">
            <div class="profile-item">
                <span class="profile-label">Name</span>
                <span class="profile-value">${user.name}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">Email</span>
                <span class="profile-value">${user.email}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">Role</span>
                <span class="profile-value">${user.role}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">Member Since</span>
                <span class="profile-value">${new Date(user.loginTime).toLocaleDateString()}</span>
            </div>
        </div>
    `;

    document.getElementById('profile-content').innerHTML = html;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }
}
