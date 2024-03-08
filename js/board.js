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

/**
 * loads Tasks from Backend 
 */

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

/**
 * call Function
 */

function init() {
  loadTasks();
  updateProgressBarWidth();
}

/**
 * loads Contacts 
 */
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

/**
 * Renders tasks for Container ID
 */

function renderTasks1() {
  containerIds.forEach((containerId) => {
    const renderContainer = document.getElementById(containerId);
    if (!renderContainer) {
      console.error("Container not found: " + containerId);
      return;
    }

    renderContainer.innerHTML = "";
    
    const searchTerm = document
      .getElementById("search_input")
      .value.toLowerCase();
    
      const tasksInContainer = tasks.filter(
        (task) =>
          task.position === containerId &&
          (task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm))
      );
      

    const noContainerElement = document.getElementById("no_" + containerId);
    if (!noContainerElement) {
      error("Element not found: no_" + containerId);
      return;
    }

    if (tasksInContainer.length === 0) {
      noContainerElement.classList.remove('hidden');
    } else {
      noContainerElement.classList.add('hidden');
    }

    tasksInContainer.forEach((task) => {
      const cardElement = renderCard(task);
      renderContainer.innerHTML += cardElement;
    });
  });
}

function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * Extract initlas 
 */
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

/**
 * gets All Subtasks
 */
function getAllSubtaskTexts(selectedTask) {
  return selectedTask.subtask
    ? selectedTask.subtask.map((subtask) => subtask.text)
    : [];
}
/**
 * Deletes Tasks
 */
function deleteTask(title) {
  const index = tasks.findIndex((task) => task.title === title);
  if (index !== -1) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks1();
    closeCardbig();
  }
}
/**
 * Saves Tasks in the Backend
 */
function saveTasks() {
  setItem("tasks", JSON.stringify(tasks));
}
/**
 * Opens Card
 */
function openCard(title) {
  const selectedTask = tasks.find((task) => task.title === title);
  if (selectedTask) {
    const infoContainer = document.getElementById("info_container");
    infoContainer.innerHTML = showInfoTasks(selectedTask);
    document.getElementById("card-big").classList.add("slide-in");
    document.getElementById("card-big").classList.remove("d-none");
  }
}

/**
 * Function for Searching Tasks
 */

function searchTask() {
  containerIds.forEach((containerId) => {
    const container = document.getElementById(containerId);
    const searchTerm = document
      .getElementById("search_input")
      .value.toLowerCase();

    const filteredTasks = tasksloaded.filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = task.description.toLowerCase().includes(searchTerm);
      

      return task.position === containerId && (titleMatch || descriptionMatch);
    });


    renderTasks(filteredTasks, container);
  });

  UpdateHtml();
}


/**
 * rendes Tasks
 */

function renderTasks(tasksToRender, container) {
  container.innerHTML = "";
  tasksToRender.forEach((task) => {
    container.innerHTML += renderCard(task);
  });
}
/**
 * redircts to Add Task
 */

function redirectToAddTask() {
  window.location.href = "add_task.html";
}
/**
 * redircts to board
 */
function redirectToBoard() {
  window.location.href = "board.html";
}
/**
 * closes Card big
 */
function closeCardbig() {
  document.getElementById("card-big").classList.add("d-none");

}

/**
 * Functions for Drag and Drop 
 */
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

/**
 * clears Formular
 */
function clearFormular() {
  document.getElementById("task_description").value = "";
  document.getElementById("task_title").value = "";
  document.getElementById("task_date").value = "";
  document.getElementById("task_category").value = "";
  document.getElementById("rendercontacts_container_small3").innerHTML = "";
  document.getElementById("rendercontacts_container_small2").innerHTML = "";
  document.getElementById('sub').innerHTML = "";
  changePrio("medium");
  selectedContacts = [];
  subtasks = [];
}

/**
 * Updates the HTML
 */

function UpdateHtml() {
  containerIds.forEach((containerId) => {
    renderTasks1(containerId);
  });
}
/**
 * closes Add Task
 */

function closeAddTask() {
  let addtaskoverlay = document.getElementById("imgclose");
  addtaskoverlay.classList.add("d-none");
}

let currentContainer = null;

/**
 * opens Add Task
 */

function openAddTask(containerId) {
  if (window.innerWidth < 660) {
    location.href = "add_task.html";
  } else {
    currentContainer = containerId;

    document.getElementById("imgclose").classList.remove("d-none");
    document.getElementById("imgclose").classList.add("slide-in");
  }
}
/**
 * Cancel Edit 
 */

function cancelEdit() {
  document.getElementById("editTaskOverlay").classList.add("d-none");
  selectedContacts = [];
}
/**
 * Animation 
 */

function AnimationTasksAdded2() {
  let animationElement = document.getElementById("task_added_board");
  animationElement.classList.remove("d-none");
  setTimeout(() => {
    animationElement.classList.add("d-none");
  }, 2000);
}
/**
 * Toogles Edit Subdrop 
 */
function toggleEditSubDrop() {
  let inputField = document.getElementById("edit_task_subtask");
  if (document.activeElement === inputField) {
    document.getElementById("edit_subtask_confirm_cancel").style.display =
      "flex";
  }
}
/**
 *  Renders Subtask
 */
function renderEditSubtask() {
  const editSubtasksContainer = document.getElementById("edit_sub");
  editSubtasksContainer.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    const subtaskElement = createEditSubtaskElement(subtask, index);
    editSubtasksContainer.appendChild(subtaskElement);
  });
}
/**
 * adds Edit Subtask 
 */

function addEditSubtask() {
  let text = document.getElementById("edit_task_subtask");
  let subtask = {
    text: text.value,
  };
  subtasks.push(subtask);
  text.value = "";
  renderEditSubtask();
}
/**
 *  edits Subtask
 */
function editEditSubtask(index) {
  let text = document.getElementById("edit_task_subtask");
  text.value = subtasks[index].text;
  deleteEditSubtask(index);
}
/**
 *  deletes Subtask
 */
function deleteEditSubtask(index) {
  subtasks.splice(index, 1);
  renderEditSubtask();
}
/**
 *  remvoes Edit Subtask
 */
function removeEditSubInput() {
  let text = document.getElementById("edit_task_subtask");
  text.value = "";
  document.getElementById("edit_subtask_confirm_cancel").style.display = "none";
}

let originalTitle;



