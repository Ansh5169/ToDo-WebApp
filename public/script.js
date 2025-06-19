// DOM Elements
const authContainer = document.getElementById('authContainer');
const todoContainer = document.getElementById('todoContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tasksList = document.getElementById('tasksList');
const userName = document.getElementById('userName');
const tabButtons = document.querySelectorAll('.tab-btn');
const filterButtons = document.querySelectorAll('.filter-btn');

// API Configuration
const API_URL = 'http://localhost:3000/api';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        showTodoContainer();
        loadUserTasks();
    }

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            switchAuthTab(tab);
        });
    });

    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterTasks(filter);
        });
    });
});

// Authentication Functions
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name);
            showTodoContainer();
            loadUserTasks();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            switchAuthTab('login');
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    showAuthContainer();
}

// Task Management Functions
async function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, description, deadline })
        });

        if (response.ok) {
            loadUserTasks();
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            document.getElementById('taskDeadline').value = '';
        } else {
            alert('Failed to add task');
        }
    } catch (error) {
        console.error('Add task error:', error);
        alert('An error occurred while adding the task');
    }
}

async function loadUserTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else {
            alert('Failed to load tasks');
        }
    } catch (error) {
        console.error('Load tasks error:', error);
        alert('An error occurred while loading tasks');
    }
}

async function updateTaskStatus(taskId, completed) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ completed })
        });

        if (response.ok) {
            loadUserTasks();
        } else {
            alert('Failed to update task status');
        }
    } catch (error) {
        console.error('Update task error:', error);
        alert('An error occurred while updating the task');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            loadUserTasks();
        } else {
            alert('Failed to delete task');
        }
    } catch (error) {
        console.error('Delete task error:', error);
        alert('An error occurred while deleting the task');
    }
}

async function editTask(taskId) {
    const task = await getTaskById(taskId);
    if (!task) return;

    const newTitle = prompt('Enter new title:', task.title);
    const newDescription = prompt('Enter new description:', task.description);
    const newDeadline = prompt('Enter new deadline (YYYY-MM-DD):', task.deadline);

    if (newTitle && newDeadline) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                    deadline: newDeadline
                })
            });

            if (response.ok) {
                loadUserTasks();
            } else {
                alert('Failed to update task');
            }
        } catch (error) {
            console.error('Edit task error:', error);
            alert('An error occurred while editing the task');
        }
    }
}

async function getTaskById(taskId) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Get task error:', error);
        return null;
    }
}

// UI Functions
function displayTasks(tasks) {
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description}</p>
                <p class="task-deadline">Deadline: ${new Date(task.deadline).toLocaleDateString()}</p>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="updateTaskStatus('${task._id}', ${!task.completed})">
                    <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                </button>
                <button class="edit-btn" onclick="editTask('${task._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask('${task._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        tasksList.appendChild(taskElement);
    });
}

function filterTasks(filter) {
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'pending':
                task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                break;
        }
    });

    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
}

function switchAuthTab(tab) {
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

function showAuthContainer() {
    authContainer.classList.remove('hidden');
    todoContainer.classList.add('hidden');
}

function showTodoContainer() {
    authContainer.classList.add('hidden');
    todoContainer.classList.remove('hidden');
    userName.textContent = localStorage.getItem('userName');
} 