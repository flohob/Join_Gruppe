tasksloaded = [];
let tasks = []; // Füge dies am Anfang deines Codes hinzu
const containerIds = ['todo', 'task_in_progress', 'task_await_feedback', 'task_done'];

async function loadTasks() {
    try {
        const loadedTasks = await getItem('tasks');
        if (loadedTasks.data.value) {
            tasks = JSON.parse(loadedTasks.data.value);
            tasksloaded = [...tasks];
            UpdateHtml();
        }
    } catch (error) {
        console.error('Loading error:', error);
    }
}

function init() {
    loadContacts();
    UpdateHtml();
    loadTasks();
}


function renderTasks1() {
    // Leere alle Container zuerst
    containerIds.forEach(containerId => {
        const renderContainer = document.getElementById(containerId);
        renderContainer.innerHTML = "";

        // Filtere die Aufgaben nach der aktuellen Container-Kategorie und dem Suchbegriff
        const searchTerm = document.getElementById("search_input").value.toLowerCase();
        const tasksInContainer = tasks.filter(task => task.position === containerId && task.title.toLowerCase().includes(searchTerm));
        console.log(tasksInContainer);
            tasksInContainer.forEach(task => {
                const cardElement = renderCard(task);
                renderContainer.innerHTML += cardElement;
            });
    });
}

function renderCard(task) {
    const subtaskHTML = task.subtask.map(sub => `<div class="subtask">${sub.text}</div>`).join('');

    // Berechne den Fortschritt in Prozent
    const progressPercentage = (task.subtask.length > 0) ? (task.subtask.filter(sub => sub.completed).length / task.subtask.length) * 100 : 0;

    // Füge einen Eventlistener für das Öffnen der detaillierten Ansicht hinzu
    return `<div class="card" draggable="true" ondragstart="handleDragStart(event,'${task.title}')" onclick="openCard('${task.title}')">
        <div class="task_category">${task.category}</div>
        <p class="task_title">${task.title}</p>
        <p class="task_description">${task.description}</p>
        <div>
            <svg id="progress_bar" width="128px" height="8px" xmlns="http://www.w3.org/2000/svg">
                <rect width="128px" height="8px" fill="#F4F4F4" rx="4px" ry="4px"/>
                <rect width="${progressPercentage}%" height="100%" fill="#4589FF" rx="4px" ry="4px"/>
            </svg>
            <span class="task_subtask">${task.subtask.length}/${task.subtask.length} Subtasks</span>
        </div>
        ${subtaskHTML}
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




function showInfoTasks(selectedTask) {
    let contactsHTML = '';

    if (Array.isArray(selectedTask.contacts) && selectedTask.contacts.length > 0) {
        contactsHTML = selectedTask.contacts.map(contactName => {
            const matchedContact = contacts.find(contact => contact.name === contactName);

            if (matchedContact) {
                // Hintergrundstil für die Initialen basierend auf der Farbe des Kontakts
                const backgroundStyle = `background-color: ${matchedContact.color};`;

                return `<div class="contact_big">
                    <div class="board_intitials" style="${backgroundStyle}">${getInitials(matchedContact)}</div>
                    ${matchedContact.name}
                </div>`;
            } else {
                return `<div class="contact_big">${contactName}</div>`;
            }
        }).join('');
    } else {
        contactsHTML = `<span>No contacts assigned</span>`;
    }

    // Subtasks HTML erstellen
    const subtasksHTML = selectedTask.subtask.map(subtask => {
        return `<div class="subtask">
                    <div class="subtask-big">${subtask.title}</div>
                    <div class="task_subtasks-big">${subtask.text}</div>
                </div>`;
    }).join('');

    return `<div id="card-big" class="card_big">
        <div class="task_category_big_container">
            <div class="task_category_big">${selectedTask.category}</div>
            <img onclick="closeCardbig()" src="/assets/add_task/cancel_blue.png">
        </div>
        <div class="task_title_big">${selectedTask.title}</div>
        <div class="task_description_big">${selectedTask.description}</div>
        <div class="task_date_big">
            <span>Due date:</span><span> ${selectedTask.date}</span>
        </div>
        <div class="task_prio_big">
            <span>Priority:</span><span>${selectedTask.priority}</span>
        </div>
        <div class="task_contacts_big">
            <span>Assigned To:</span>
            ${contactsHTML}
        </div>
        <div class="subtasks-container">
            <span>Subtasks:</span>
            ${subtasksHTML}
        </div>
        <div class="editBTN">
        <img src="assets/add_task/edit.png" onclick="editTask('${selectedTask.title}')">
        <img src="assets/add_task/delete.png" onclick="deleteTask('${selectedTask.title}')">
        </div>
    </div>`;
}





function deleteTask(title) {
    const index = tasks.findIndex(task => task.title === title);

    if (index !== -1) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks1();
        closeCardbig();
    } else {
        console.error('Task not found:', title);
    }
}

function editTask(title) {
    const selectedTask = tasks.find(task => task.title === title);

    if (selectedTask) {
        // Lege eine Kopie der Originalaufgabe an
        const originalTask = JSON.parse(JSON.stringify(selectedTask));

        // Füge die Bearbeitungselemente hinzu
        const editTaskElement = document.createElement("div");
        editTaskElement.id = "editTaskForm";
        editTaskElement.className = "card_big_edit";

        // Formular für die Bearbeitung
        editTaskElement.innerHTML = `
            <div class="card-big">
                <h2>Edit Task</h2>

            </div>
            <form>
                <label for="editTitle">Title:</label>
                <input type="text" id="editTitle" value="${originalTask.title}" required>

                <label for="editDescription">Description:</label>
                <textarea id="editDescription" required>${originalTask.description}</textarea>

                <label for="editDate">Due Date:</label>
                <input type="date" id="editDate" value="${originalTask.date}" required>

                <label for="editContacts">Assigned To:</label>
                <select id="editContacts" multiple>
                    <!-- Hier könntest du die Kontakte auswählen -->
                </select>

                <label for="editSubtasks">Subtasks:</label>
                <div id="editSubtasks">
                    <!-- Hier könntest du die vorhandenen Subtasks anzeigen -->
                </div>
                <button type="button" onclick="submitEditTask('${originalTask.title}')">Save</button>
                <button onclick="cancelEdit('${originalTask.title}')">Cancel</button>
            </form>
        `;


        const infoContainer = document.getElementById('info_container');
        infoContainer.innerHTML = '';
        infoContainer.appendChild(editTaskElement);

        // Lade Kontakte in das Dropdown
        loadContactsDropdown("editContacts");

        // Lade vorhandene Subtasks
        loadExistingSubtasks(originalTask.subtask, "editSubtasks");
    } else {
        console.error('Task not found:', title);
    }
}

function cancelEdit() {
document.getElementById('editTaskForm').classList.add('d-none');
}


function submitEditTask(title) {
    const selectedTask = tasks.find(task => task.title === title);

    if (selectedTask) {
        // Lies die Werte aus dem Formular
        const newTitle = document.getElementById('editTitle').value;
        const newDescription = document.getElementById('editDescription').value;
        const newDate = document.getElementById('editDate').value;
        const newContacts = Array.from(document.getElementById('editContacts').selectedOptions).map(option => option.value);
        console.log('Selected Contacts:', newContacts);
        // Aktualisiere den ausgewählten Task
        selectedTask.title = newTitle;
        selectedTask.description = newDescription;
        selectedTask.date = newDate;
        selectedTask.contacts = newContacts;
        console.log(selectedTask.contacts)

        // Speichere den aktualisierten Task
        saveTasks();
        cancelEdit();

        // Aktualisiere das Kontaktdropdown
        loadContactsDropdown("editContacts");

        // Aktualisiere die Anzeige
        renderTasks1();

        // Schließe das Formular oder aktualisiere die ShowInfo-Ansicht auf andere Weise
        // ...
    } else {
        console.error('Task not found:', title);
    }
}

function loadContactsDropdown(containerId) {
    const container = document.getElementById(containerId);

    // Leere das Dropdown zuerst
    container.innerHTML = '';

    // Lade die Kontakte ins Dropdown
    if (contacts && Array.isArray(contacts) && contacts.length > 0) {
        contacts.forEach(contact => {
            const option = document.createElement('option');
            option.value = contact.name;
            option.textContent = contact.name;
            container.appendChild(option);
            console.log('Loaded Contacts in Dropdown:', container.innerHTML);
        });
    } else {
        console.error('No contacts available.');
    }
}


function loadExistingSubtasks(existingSubtasks, containerId) {
    const container = document.getElementById(containerId);

    // Leere das Container-Element zuerst
    container.innerHTML = '';

    // Iteriere durch die vorhandenen Subtasks und füge sie dem Container hinzu
    existingSubtasks.forEach(subtask => {
        const subtaskElement = document.createElement("div");
        subtaskElement.classList.add("subtask");
        subtaskElement.textContent = subtask.text;
        container.appendChild(subtaskElement);
    });
}

function saveTasks() {
    // Speichere die Aufgaben im localStorage (ersetze dies durch deine eigene Speicherlogik)
    setItem('tasks', JSON.stringify(tasks));
}


function openCard(title) {
    const selectedTask = tasks.find(task => task.title === title);
    if (selectedTask) {
        console.log('Selected Task:', selectedTask);
        const infoContainer = document.getElementById('info_container');


        infoContainer.innerHTML = showInfoTasks(selectedTask);

        // Öffne das Karten-Detailfenster
        document.getElementById('card-big').classList.remove('d-none');
    } else {
        console.error('Task not found:', title);
    }
}

function searchTask() {
    // Leere alle Container zuerst
    containerIds.forEach(containerId => {
        const container = document.getElementById(containerId);
        const searchTerm = document.getElementById("search_input").value.toLowerCase();

        // Filtere die Aufgaben nach der aktuellen Container-Kategorie und dem Suchbegriff
        const filteredTasks = tasksloaded.filter(task => task.position === containerId && task.title.toLowerCase().includes(searchTerm));
        
        // Rendere die gefilterten Aufgaben in den Container
        renderTasks(filteredTasks, container);
    });

    // Aktualisiere die Anzeige nach der Suche
    UpdateHtml();
}


function renderTasks(tasksToRender, container) {
    container.innerHTML = "";

    tasksToRender.forEach(task => {
        container.innerHTML += renderCard(task);
    });
}

function redirectToAddTask() {
    window.location.href = "add_task.html";
}

function closeCardbig() {
    document.getElementById('card-big').classList.add('d-none');
}

async function loadContacts() {
    try {
        const loadedContacts = await getItem('contacts');
        if (loadedContacts.data.value) {
          console.log(loadedContacts);
            contacts = JSON.parse(loadedContacts.data.value);

            console.log('Contacts loaded successfully.');
        }
    } catch (error) {
        console.error('Loading error:', error);
    }
  }

  function getInitials(contact){
    let namesSplit = contact.name.split(" ")
    let firstName = namesSplit[0].charAt(0);
      let lastName = namesSplit[1].charAt(0);
      return(firstName + lastName)
  }

  function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

let currentDraggedElement = null;

function handleDragStart(event, title) {
    event.dataTransfer.setData('text/plain', title);
    currentDraggedElement = title;
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const targetContainerId = event.currentTarget.id;

    if (currentDraggedElement) {
        const draggedTask = tasks.find(task => task.title === currentDraggedElement);

        if (draggedTask && draggedTask.position !== targetContainerId) {
            draggedTask.position = targetContainerId;
            saveTasks();
            renderTasks1();
        }
    }
}

function addTask() {
    let description = document.getElementById('task_description').value;
    let title = document.getElementById('task_title').value;
    let date = document.getElementById('task_date').value;
    let category = document.getElementById('task_category').value;
  
    if (description === "") {
      description = 'Keine Beschreibung';
    }
  
    // Extrahiere nur die Namen der ausgewählten Kontakte
    let selectedContactsNames = selectedContacts.map(contact => contact.name);
  
    let task = {
      'title': title,
      'description': description,
      'date': date,
      'priority': prioity,
      'contacts': selectedContactsNames, 
      'category': category,
      'subtask': subtasks,
      'position': 'todo',
    };
    
  
    tasks.push(task);
    saveTasks();
    clearForm();
    renderTasks1();
  }


function UpdateHtml() {
    // Iterieren Sie durch jede Container-ID
    containerIds.forEach(containerId => {
        renderTasks1(containerId); // Hier den Container-ID-Parameter hinzufügen
    });
}

function closeAddTask() {
    let addtaskoverlay = document.getElementById('imgclose');
    addtaskoverlay.classList.add('d-none')
}

let currentContainer = null;

function openAddTask(containerId) {
    currentContainer = containerId; // Setze den aktuellen Container
    document.getElementById('imgclose').classList.remove('d-none');
  }