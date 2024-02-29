tasksloaded = [];
let tasks = [];
const containerIds = [
  "todo",
  "task_in_progress",
  "task_await_feedback",
  "task_done",
];
let contacts_board = [];
let subtask_loaded = [];
let contactsDropdown;
let categoryOpen2 = false;
let editedPrioity = "medium";

async function loadTasks() {
  try {
    const loadedTasks = await getItem("tasks");
    if (loadedTasks.data.value) {
      tasks = JSON.parse(loadedTasks.data.value);
      tasksloaded = [...tasks];
      await loadContacts_board();
      UpdateHtml();
    }
  } catch (error) {
    console.error("Loading error:", error);
  }
}

function init() {
  loadTasks();
}

async function loadContacts_board() {
  try {
    const loadedContacts = await getItem("contacts");
    if (loadedContacts.data.value) {
      const contacts = JSON.parse(loadedContacts.data.value);
      contacts_board.push(contacts);
    }
  } catch (error) {
    console.error("Loading error:", error);
  }
}

function renderTasks1() {
  containerIds.forEach((containerId) => {
    const renderContainer = document.getElementById(containerId);
    renderContainer.innerHTML = "";
    const searchTerm = document
      .getElementById("search_input")
      .value.toLowerCase();
    const tasksInContainer = tasks.filter(
      (task) =>
        task.position === containerId &&
        task.title.toLowerCase().includes(searchTerm)
    );
    tasksInContainer.forEach((task) => {
      const cardElement = renderCard(task);
      renderContainer.innerHTML += cardElement;
    });
  });
}

function extractInitialsFromContact(contact) {
  if (typeof contact === "string") {
    return contact
      .split(" ")
      .map((name) => name[0].toUpperCase())
      .join("");
  } else {
    console.error("Invalid contact format:", contact);
    return "";
  }
}

// Funktion zur Extraktion der Initialen aus dem Kontakte-Array
function extractInitials(selectedTask) {
  return selectedTask.contacts?.map(extractInitialsFromContact) || [];
}

function getAllSubtaskTexts(selectedTask) {
  return selectedTask.subtask
    ? selectedTask.subtask.map((subtask) => subtask.text)
    : [];
}

function deleteTask(title) {
  const index = tasks.findIndex((task) => task.title === title);
  if (index !== -1) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks1();
    closeCardbig();
  }
}

function saveTasks() {
  setItem("tasks", JSON.stringify(tasks));
}

function openCard(title) {
  const selectedTask = tasks.find((task) => task.title === title);
  console.log(selectedTask);
  if (selectedTask) {
    const infoContainer = document.getElementById("info_container");
    infoContainer.innerHTML = showInfoTasks(selectedTask);
    document.getElementById("card-big").classList.add("slide-in");
    document.getElementById("card-big").classList.remove("d-none");
  }
}

function searchTask() {
  containerIds.forEach((containerId) => {
    const container = document.getElementById(containerId);
    const searchTerm = document
      .getElementById("search_input")
      .value.toLowerCase();
    const filteredTasks = tasksloaded.filter(
      (task) =>
        task.position === containerId &&
        task.title.toLowerCase().includes(searchTerm)
    );
    renderTasks(filteredTasks, container);
  });
  UpdateHtml();
}

function renderTasks(tasksToRender, container) {
  container.innerHTML = "";
  tasksToRender.forEach((task) => {
    container.innerHTML += renderCard(task);
  });
}

function redirectToAddTask() {
  window.location.href = "add_task.html";
}

function redirectToBoard() {
  window.location.href = "board.html";
}

function closeCardbig() {
  document.getElementById("card-big").classList.add("d-none");
}
function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}
let currentDraggedElement = null;

function handleDragStart(event, title) {
  event.dataTransfer.setData("text/plain", title);
  currentDraggedElement = title;
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const targetContainerId = event.currentTarget.id;
  if (currentDraggedElement) {
    const draggedTask = tasks.find(
      (task) => task.title === currentDraggedElement
    );
    if (draggedTask && draggedTask.position !== targetContainerId) {
      draggedTask.position = targetContainerId;
      saveTasks();
      renderTasks1();
    }
  }
}

function clearFormular() {
  document.getElementById("task_description").value = "";
  document.getElementById("task_title").value = "";
  document.getElementById("task_date").value = "";
  document.getElementById("task_category").value = "";
  document.getElementById("rendercontacts_container_small3").innerHTML = "";
  document.getElementById("rendercontacts_container_small2").innerHTML = "";
  changePrio("medium");
  selectedContacts = [];
  subtasks = [];
}

function addTask() {
  let description = document.getElementById("task_description").value;
  let title = document.getElementById("task_title").value;
  let date = document.getElementById("task_date").value;
  let category = document.getElementById("task_category").value;

  if (title.trim() === "" || date.trim() === "" || category.trim() === "") {
    alert("Bitte Felder ausfüllen");
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
    priority: prioity, // Bitte sicherstellen, dass prioity definiert ist
    contacts: selectedContactsNames2,
    category: category,
    subtask: subtasks, // Bitte sicherstellen, dass subtasks definiert ist
    position: currentContainer,
  };

  tasks.push(task);
  saveTasks();
  clearFormular();
  AnimationTasksAdded2();
  renderTasks1();
  closeAddTask();
}

function UpdateHtml() {
  containerIds.forEach((containerId) => {
    renderTasks1(containerId);
  });
}

function closeAddTask() {
  let addtaskoverlay = document.getElementById("imgclose");
  addtaskoverlay.classList.add("d-none");
}

let currentContainer = null;

function openAddTask(containerId) {
  if (window.innerWidth < 660) {
    location.href = "add_task.html";
  } else {
    currentContainer = containerId;

    document.getElementById("imgclose").classList.remove("d-none");
    document.getElementById("imgclose").classList.add("slide-in");
  }
}

function cancelEdit() {
  document.getElementById("editTaskOverlay").classList.add("d-none");
  selectedContacts = [];
}

function AnimationTasksAdded2() {
  let animationElement = document.getElementById("task_added_board");
  animationElement.classList.remove("d-none");
  setTimeout(() => {
    animationElement.classList.add("d-none");
  }, 2000);
}

function toggleEditSubDrop() {
  let inputField = document.getElementById("edit_task_subtask");
  if (document.activeElement === inputField) {
    document.getElementById("edit_subtask_confirm_cancel").style.display =
      "flex";
  }
}

function renderEditSubtask() {
  const editSubtasksContainer = document.getElementById("edit_sub");
  editSubtasksContainer.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    const subtaskElement = createEditSubtaskElement(subtask, index);
    editSubtasksContainer.appendChild(subtaskElement);
  });
}

function addEditSubtask() {
  let text = document.getElementById("edit_task_subtask");
  let subtask = {
    text: text.value,
  };
  subtasks.push(subtask);
  text.value = "";
  renderEditSubtask();
}

function editEditSubtask(index) {
  let text = document.getElementById("edit_task_subtask");
  text.value = subtasks[index].text;
  deleteEditSubtask(index);
}

function deleteEditSubtask(index) {
  subtasks.splice(index, 1);
  renderEditSubtask();
}

function removeEditSubInput() {
  let text = document.getElementById("edit_task_subtask");
  text.value = "";
  document.getElementById("edit_subtask_confirm_cancel").style.display = "none";
}

let originalTitle;

function editTask(title) {
  closeCardbig();
  const selectedTask = tasks.find((task) => task.title === title);
  if (selectedTask) {
    originalTitle = selectedTask.title;
    document.getElementById("edit_task_title").value = selectedTask.title;
    document.getElementById("edit_task_description").value =
      selectedTask.description;
    document.getElementById("edit_task_date").value = selectedTask.date;

    // Setze die ausgewählten Kontakte
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

function saveEditTask() {
  console.log("saveEditTask aufgerufen");
  const editedTitle = document.getElementById("edit_task_title").value;
  const editedDescription = document.getElementById(
    "edit_task_description"
  ).value;
  const editedDate = document.getElementById("edit_task_date").value;
  const editedCategory = document.getElementById("task_category_edit").value;

  // Finde den Index des bearbeiteten Tasks anhand des ursprünglichen Titels
  const editedTaskIndex = tasks.findIndex(
    (task) => task.title === originalTitle
  );

  if (editedTaskIndex !== -1) {
    // Aktualisiere die Werte des bearbeiteten Tasks
    tasks[editedTaskIndex].title = editedTitle;
    tasks[editedTaskIndex].description = editedDescription;
    tasks[editedTaskIndex].date = editedDate;
    tasks[editedTaskIndex].subtask = [...subtasks]; // Aktualisiere Subtasks

    // Hier das Format Name:... Color:... für Kontakte speichern
    const selectedContactsData = selectedContacts.map((contact) => {
      return { name: contact.name, color: contact.color };
    });

    tasks[editedTaskIndex].contacts = selectedContactsData;
    tasks[editedTaskIndex].category = editedCategory;
    tasks[editedTaskIndex].priority = editedPrioity; // Speichere die aktualisierte Priorität

    // Speichere die aktualisierten Tasks
    saveTasks();
    renderTasks1();
  }
}

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

// Funktion zum Ändern der Priorität während der Bearbeitung eines Tasks
function changePrioEdit(prio) {
  clearPrioEdit();
  editedPrioity = prio;
  let selectedPrio = document.getElementById(`${prio}_edit`);
  selectedPrio.classList.add(`${prio}`);
  selectedPrio.classList.remove(`hover_${prio}`);
  document.getElementById(`${prio}_svg`).style.fill = "white";
}

// Funktion zum Zurücksetzen der Priorität während der Bearbeitung eines Tasks
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
