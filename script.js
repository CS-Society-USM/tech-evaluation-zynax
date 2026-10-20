document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');

    // load saved tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTasks() {
        localStorage.setItem('todos', JSON.stringify(tasks));
    }

    function updateCounter() {
        const activeCount = tasks.filter(t => !t.completed).length;
        taskCount.textContent = `${activeCount} task${activeCount === 1 ? '' : 's'} remaining`;
    }

    function renderTasks() {
        taskList.innerHTML = '';

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            if (task.completed) {
                li.classList.add('completed');
            }

            // task text
            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.textContent = task.text;

            // delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';

            // delete click handler
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevents triggering task toggle when clicking delete
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            // toggle item completion when clicking anywhere on the row
            li.addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            li.appendChild(textSpan);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });

        updateCounter();
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text === '') return;

        tasks.push({ text: text, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }

    addBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    renderTasks();
});