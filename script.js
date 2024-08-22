// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Task Array to Store Tasks
let tasks = [];

// Add Task
const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        renderTasks();
        taskInput.value = '';
    }
};

// Render Tasks
const renderTasks = (filter = 'all') => {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
};

// Mark Task as Completed
const toggleTaskCompletion = (id) => {
    tasks = tasks.map(task => task.id === Number(id) ? { ...task, completed: !task.completed } : task);
    renderTasks(getActiveFilter());
};

// Delete Task
const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== Number(id));
    renderTasks(getActiveFilter());
};

// Edit Task
const editTask = (id) => {
    const task = tasks.find(task => task.id === Number(id));
    const newTaskText = prompt('Edit Task:', task.text);
    if (newTaskText) {
        tasks = tasks.map(task => task.id === Number(id) ? { ...task, text: newTaskText } : task);
        renderTasks(getActiveFilter());
    }
};

// Get Active Filter
const getActiveFilter = () => {
    return document.querySelector('.filter-btn.active').dataset.filter;
};

// Handle Task Actions (Complete, Edit, Delete)
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('complete-btn')) {
        toggleTaskCompletion(e.target.closest('.task-item').dataset.id);
    } else if (e.target.classList.contains('delete-btn')) {
        deleteTask(e.target.closest('.task-item').dataset.id);
    } else if (e.target.classList.contains('edit-btn')) {
        editTask(e.target.closest('.task-item').dataset.id);
    }
});

// Handle Add Task Button Click
addTaskBtn.addEventListener('click', addTask);

// Handle Filter Button Clicks
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(button => button.classList.remove('active'));
        btn.classList.add('active');
        renderTasks(btn.dataset.filter);
    });
});

// Initialize with 'All' Filter Active
filterButtons[0].classList.add('active');
renderTasks();
