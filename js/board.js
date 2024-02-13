tasksloaded = [];

async function loadTasks() {
    try {
        const loadedTasks = await getItem('tasks');
        if (loadedTasks.data.value) {
            console.log(loadedTasks);
            tasks = JSON.parse(loadedTasks.data.value);
            console.log('tasks loaded successfully.');
            tasksloaded.push(...tasks); // Beachte die Spread-Operator-Verwendung, um einzelne Aufgaben hinzuzufügen
            renderTasks();
        }
    } catch (error) {
        console.error('Loading error:', error);
    }
}


    function init() {
        loadTasks();
        renderTasks();
    }

    function renderTasks() {
        const renderContainer = document.getElementById('render_container');
        
        // Iteriere durch jedes Element in tasksloaded und rufe renderCard auf
        tasksloaded.forEach(task => {
            renderContainer.innerHTML += renderCard(task);
        });
    }
    
    function renderCard(task) {
        return `<div class="card">
            <div class="task_category">${task.category}</div>
            <p class="task_title">${task.title}</p>
            <p class="task_description">${task.description}</p>
            <div>
                <svg id="progress_bar" width="128px" height="8px" xmlns="http://www.w3.org/2000/svg">
                    <!-- Hintergrundrechteck -->
                    <rect width="128px" height="8px" fill="#F4F4F4" rx="4px" ry="4px"/>
                    <!-- Fortschrittsbalken -->
                    <rect width="50%" height="100%" fill="#4589FF" rx="4px" ry="4px"/>
                </svg>
                <span class="task_subtask">${task.subtasks}/${task.subtasks} Subtasks</span>
            </div>
            <div class="task_contacts_prio">
                <div class="task_contacts"></div>
                <div class="task_prio">
                    <svg id="task_medium_svg" xmlns="http://www.w3.org/2000/svg" width="45px" height="30px" fill="#FFA800" class="bi bi-pause" viewBox="0 0 16 16">
                        <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/>
                    </svg>
                </div>
            </div>
        </div>`;
    }