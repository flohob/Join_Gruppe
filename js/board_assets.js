/**
 * toogles Contacts Dropdown
 */
function toggleContactsDropdown() {
  const dropdown = document.getElementById("dropdown_contacts2");
  const isVisible = !dropdown.classList.contains("d-none");
  renderContactsSmall3();
  if (isVisible) {
    dropdown.classList.add("d-none");
  } else {
    dropdown.classList.remove("d-none");
    showContactsDropdown(!isVisible);
  }
}
/**
 * Renders Small Contacts which are choosen
 */
function renderContactsSmall3() {
  let smallContainer = document.getElementById(
    "rendercontacts_container_small3"
  );
  smallContainer.innerHTML = "";

  selectedContacts.forEach((contact) => {
    const initials = getInitials(contact);
    smallContainer.innerHTML += `
        <svg width="42px" height="42px" xmlns="http://www.w3.org/2000/svg">
          <!-- Äußerer Kreis -->
          <circle cx="21px" cy="21px" r="20px" stroke="white" stroke-width="3" fill="transparent" />
          <!-- Innerer Kreis -->
          <circle cx="21px" cy="21px" r="19px" fill="${contact.color}" />
          <text fill="white" x="21px" y="23px"  alignment-baseline="middle" text-anchor="middle" >
            ${initials}
          </text>
        </svg>`;
  });
}

/**
 * Function for edtiting Priority
 */
function changePrioEdit(prio) {
  clearPrioEdit();
  editedPrioity = prio;
  let selectedPrio = document.getElementById(`${prio}_edit`);
  selectedPrio.classList.add(`${prio}`);
  selectedPrio.classList.remove(`hover_${prio}`);
  document.getElementById(`${prio}_svg`).style.fill = "white";
}

/**
 * Clears Prio
 */
function clearPrioEdit() {
  let urgent = document.getElementById("urgent_edit");
  urgent.classList.remove("urgent");
  urgent.classList.add("hover_urgent");
  document.getElementById(`urgent_svg`).style.fill = "#FF3D00";
  let medium = document.getElementById("medium_edit");
  medium.classList.remove("medium");
  medium.classList.add("hover_medium");
  document.getElementById(`medium_svg`).style.fill = "white";
  let low = document.getElementById("low_edit");
  low.classList.remove("low");
  low.classList.add("hover_low");
  document.getElementById(`low_svg`).style.fill = "#7AE229";
  editedPrioity = "medium";
}

/**
 * Opens Move Overlay
 */

function openMoveOverlay(title) {
  const overlayElement = document.getElementById("moveOverlay");
  event.stopPropagation();
  overlayElement.classList.remove("d-none");
  document.getElementById("moveToDoButton").onclick = () =>
    moveTaskToPosition(title, "todo");
  document.getElementById("moveInProgressButton").onclick = () =>
    moveTaskToPosition(title, "task_in_progress");
  document.getElementById("moveAwaitFeedbackButton").onclick = () =>
    moveTaskToPosition(title, "task_await_feedback");
  document.getElementById("moveDoneButton").onclick = () =>
    moveTaskToPosition(title, "task_done");
}
/**
 * Moves Position for Tasks
 */
function moveTaskToPosition(title, newPosition) {
  const taskToMove = tasks.find((task) => task.title === title);
  if (taskToMove) {
    taskToMove.position = newPosition;
    saveTasks();
    renderTasks1();
    closeMoveOverlay();
  }
}
/**
 * Closes Overlay
 */
function closeMoveOverlay() {
  const overlayElement = document.getElementById("moveOverlay");
  overlayElement.classList.add("d-none");
}
/**
 * Saves Editied Tasks
 */
function saveEditTask() {
  const editedTitle = document.getElementById("edit_task_title").value;
  const editedDescription = document.getElementById(
    "edit_task_description"
  ).value;
  const editedDate = document.getElementById("edit_task_date").value;
  const editedCategory = document.getElementById("task_category_edit").value;
  const editedTaskIndex = tasks.findIndex(
    (task) => task.title === originalTitle
  );

  if (editedTaskIndex !== -1) {
    tasks[editedTaskIndex].title = editedTitle;
    tasks[editedTaskIndex].description = editedDescription;
    tasks[editedTaskIndex].date = editedDate;
    tasks[editedTaskIndex].subtask = [...subtasks];
    const selectedContactsData = selectedContacts.map((contact) => {
      return { name: contact.name, color: contact.color };
    });

    tasks[editedTaskIndex].contacts = selectedContactsData;
    tasks[editedTaskIndex].category = editedCategory;
    tasks[editedTaskIndex].priority = editedPrioity;
    saveTasks();
    renderTasks1();
  }
}

/**
 * Edits Tasks
 */

function editTask(title) {
  closeCardbig();
  const selectedTask = tasks.find((task) => task.title === title);
  if (selectedTask) {
    originalTitle = selectedTask.title;
    document.getElementById("edit_task_title").value = selectedTask.title;
    document.getElementById("edit_task_description").value =
      selectedTask.description;
    document.getElementById("edit_task_date").value = selectedTask.date;
    selectedTask.contacts.forEach((contact) => {
      const contactObj = contacts_board[0].find((c) => c.name === contact.name);
      if (contactObj) {
        selectedContacts.push(contactObj);
      }
    });

    document.getElementById("task_category_edit").value = selectedTask.category;
    subtasks = [...selectedTask.subtask];
    renderEditSubtask();
    renderContactsSmall3();
    document.getElementById("editTaskOverlay").classList.remove("d-none");
  }
}

/**
 * Saves Edit Tasks 
 */
function saveEditTask() {
  const editedTitle = document.getElementById("edit_task_title").value;
  const editedDescription = document.getElementById(
    "edit_task_description"
  ).value;
  const editedDate = document.getElementById("edit_task_date").value;
  const editedCategory = document.getElementById("task_category_edit").value;
  const editedTaskIndex = tasks.findIndex(
    (task) => task.title === originalTitle
  );

  if (editedTaskIndex !== -1) {
    tasks[editedTaskIndex].title = editedTitle;
    tasks[editedTaskIndex].description = editedDescription;
    tasks[editedTaskIndex].date = editedDate;
    tasks[editedTaskIndex].subtask = [...subtasks];
    const selectedContactsData = selectedContacts.map((contact) => {
      return { name: contact.name, color: contact.color };
    });
    tasks[editedTaskIndex].contacts = selectedContactsData;
    tasks[editedTaskIndex].category = editedCategory;
    tasks[editedTaskIndex].priority = editedPrioity;
    saveTasks();
    renderTasks1();
    cancelEdit();
  }
}

/**
 *  Adds Task
 */

function addTask() {
  let description = document.getElementById("task_description").value;
  let title = document.getElementById("task_title").value;
  let date = document.getElementById("task_date").value;
  let category = document.getElementById("task_category").value;

  if (title.trim() === "" || date.trim() === "" || category.trim() === "") {
    document.getElementById("title_reqiuered").classList.remove("d-none");
    document.getElementById("date_reqiuered").classList.remove("d-none");
    document.getElementById("category_reqiuered").classList.remove("d-none");
    // Hide the error message after 3 seconds
    setTimeout(() => {
      document.getElementById("category_reqiuered").classList.add("d-none");
      document.getElementById("title_reqiuered").classList.add("d-none");
      document.getElementById("date_reqiuered").classList.add("d-none");
    }, 3000);
    return;
  }

  if (description === "") {
    description = "Keine Beschreibung";
  }
  const selectedContactsNames2 = selectedContacts.map((contact) => {
    return { name: contact.name, color: contact.color };
  });

  let task = {
    title: title,
    description: description,
    date: date,
    priority: prioity,
    contacts: selectedContactsNames2,
    category: category,
    subtask: subtasks,
    position: currentContainer,
  };

  tasks.push(task);
  saveTasks();
  clearFormular();
  AnimationTasksAdded2();
  renderTasks1();
  closeAddTask();
}
