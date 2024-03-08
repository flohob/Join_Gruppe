let contactsOpen = false;
let categoryOpen = false;
let selectedContacts = [];
let subtasks = [];
let prioity = "medium";
let tasks = [];
let contacts = [];

/**Checks Forms for Right Form Validation, adds a Div which tells teh User which Fields are required
 */
function checkForms() {
  let checkTitle = document.getElementById("title");
  let checkDate = document.getElementById("date");
  let selectedCategory = document.getElementById("category");

  if (checkTitle.checkValidity()) {
    removeRequiered("title");
    if (checkDate.checkValidity()) {
      removeRequiered("date");
      if (selectedCategory.checkValidity()) {
        removeRequiered("category");
        addTask();
      } else addRequiered("category");
    } else addRequiered("date");
  } else addRequiered("title");
}
/**
 * loads Contacts form Backend for Contact Toogle, User gets to choose between all Contacts
 */
async function loadContacts() {
  try {
    const loadedContacts = await getItem("contacts");
    if (loadedContacts.data.value) {
      const contact = JSON.parse(loadedContacts.data.value);
      contacts.push(contact);
    }
    return [];
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
    return [];
  }
}
/**
 * Eventlistener for clicking outside the Form to close the Dropdown
 */
document.addEventListener("click", function (event) {
  const contactsContainer = document.getElementById("dropdown_contacts");
  const categoryContainer = document.getElementById("dropdown_category");
  const taskContactsInput = document.getElementById("task_contacts");
  const taskCategoryInput = document.getElementById("task_category");

  if (
    !contactsContainer.contains(event.target) &&
    !taskContactsInput.contains(event.target)
  ) {
    // Der Klick war außerhalb des Kontakte-Dropdowns und des Input-Felds
    closeContacts(contactsContainer);
  }
  if (
    !categoryContainer.contains(event.target) &&
    !taskCategoryInput.contains(event.target)
  ) {
    // Der Klick war außerhalb des Kategorie-Dropdowns und des Input-Felds
    closeCategory(categoryContainer);
  }
});

/**
 * Adds required for Form Validation
 */
function addRequiered(where) {
  document.getElementById(`${where}_reqiuered`).classList.remove("d-none");
  if (where === "description") {
    document
      .getElementById(`task_${where}`)
      .classList.add(`requiered_${where}`);
  } else document.getElementById(`task_${where}`).classList.add("requiered");
}
/**
 * Removes the required Forms
 */
function removeRequiered(where) {
  document.getElementById(`${where}_reqiuered`).classList.add("d-none");
  if (where === "description") {
    document
      .getElementById(`task_${where}`)
      .classList.remove(`requiered_${where}`);
  } else document.getElementById(`task_${where}`).classList.remove("requiered");
}

/**
 * clears Forms with a refresh
 */
function clearForm() {
  location.reload();
}
/**
 * Changes the Textcolor of the Date
 */
function changeTextColor() {
  let dateInput = document.getElementById("task_date");
  let selectedDate = dateInput.value;

  if (selectedDate !== "") {
    dateInput.style.color = "black";
  } else {
    dateInput.style.color = "rgba(209, 209, 209, 1)";
  }
}
/**
 *
 * Changes the Priority for the Task
 */
function changePrio(prio) {
  clearPrio();
  prioity = prio;
  let selectedPrio = document.getElementById(`${prio}`);
  selectedPrio.classList.add(`${prio}`);
  selectedPrio.classList.remove(`hover_${prio}`);
  document.getElementById(`${prio}_svg`).style.fill = "white";
}
/**
 * clears the Priority and change it to medium
 */

function clearPrio() {
  let urgent = document.getElementById("urgent");
  urgent.classList.remove("urgent");
  urgent.classList.add("hover_urgent");
  document.getElementById(`urgent_svg`).style.fill = "#FF3D00";
  let medium = document.getElementById("medium");
  medium.classList.remove("medium");
  medium.classList.add("hover_medium");
  document.getElementById(`medium_svg`).style.fill = "#FFA800";
  let low = document.getElementById("low");
  low.classList.remove("low");
  low.classList.add("hover_low");
  document.getElementById(`low_svg`).style.fill = "#7AE229";
  prioity = "medium";
}
/**
 * toggles Function for dropdown
 */

function toggleContDrop() {
  let inputField = document.getElementById("task_contacts");
  let contactsContainer = document.getElementById("dropdown_contacts");
  if (contactsOpen) {
    closeContacts(contactsContainer);
    inputField.blur();
  } else {
    openContacts(contactsContainer);
  }
}
/**
 *
 * Opens Contacts Dropdown
 */

function openContacts(contactsContainer) {
  contactsContainer.classList.remove("d-none");
  document
    .getElementById("task_contacts")
    .setAttribute("placeholder", "Select Contact");
  contactsOpen = true;
  contactsContainer.innerHTML = "";
  const contactsArray = contacts[0];
  for (let index = 0; index < contactsArray.length; index++) {
    const contact = contactsArray[index];
    let initials = getInitials(contact);
    contactsContainer.innerHTML += renderDropdownContacts(
      contact,
      initials,
      index
    );
  }
}

/**
 *
 * Get initials for Dropdown for better Design
 */

function getInitials(contact) {
  let namesSplit = contact.name.split(" ");
  let firstName = namesSplit[0].charAt(0);
  let lastName = namesSplit.length > 1 ? namesSplit[1].charAt(0) : " ";
  return firstName + lastName;
}

function addTask() {
  let description = document.getElementById("task_description").value;
  let title = document.getElementById("task_title").value;
  let date = document.getElementById("task_date").value;
  let category = document.getElementById("task_category").value;

  if (title.trim() === "" || date.trim() === "" || category.trim() === "") {
    checkForms();
    return;
  }

  if (description === "") {
    description = "Keine Beschreibung";
  }

  const selectedContactsNames = selectedContacts.map((contact) => {
    return { name: contact.name, color: contact.color };
  });

  let task = {
    title: title,
    description: description,
    date: date,
    priority: prioity,
    contacts: selectedContactsNames,
    category: category,
    subtask: subtasks,
    position: "todo",
  };

  tasks.push(task);
  saveTasks();
  AnimationTasksAdded();
}

/**
 *
 * closes Contacts Dropdown
 */
function closeContacts(contactsContainer) {
  contactsContainer.classList.add("d-none");
  document
    .getElementById("task_contacts")
    .setAttribute("placeholder", "Select contacts to assign");
  contactsOpen = false;
}

/**
 * toogles dropdown category
 */
function toggleCatDrop() {
  let inputField = document.getElementById("task_category");
  let categoryContainer = document.getElementById("dropdown_category");
  if (categoryOpen) {
    closeCategory(categoryContainer);
    inputField.blur();
  } else {
    openCategory(categoryContainer);
  }
}
/**
 *
 * Opens Category close and select
 */
function openCategory(categoryContainer) {
  categoryContainer.classList.remove("d-none");
  document
    .getElementById("task_category")
    .setAttribute("placeholder", "Search category");
  categoryOpen = true;
}

function closeCategory(categoryContainer) {
  categoryContainer.classList.add("d-none");
  document
    .getElementById("task_category")
    .setAttribute("placeholder", "Select task category");
  categoryOpen = false;
}

function selectCategory(category) {
  document.getElementById("task_category").value = category;
  toggleCatDrop();
}

/**
 * toggle for Subtask
 */
function toggleSubDrop() {
  let inputField = document.getElementById("task_subtask");
  if (document.activeElement === inputField) {
    document.getElementById("subtask_confirm_cancel").style.display = "flex";
  }
}

/**
 * Adds Subtasks
 */

function addSubtask() {
  let text = document.getElementById("task_subtask");
  let subtask = {
    text: text.value,
    checked: false,
  };
  subtasks.push(subtask);
  text.value = "";
  removeRequiered("title");
  document.getElementById("subtask_confirm_cancel").style.display = "none";
  renderSubtask();
}

/**
 * Removes Subtask Input
 */

function removeSubInput() {
  document.getElementById("task_subtask").value = "";
  document.getElementById("subtask_confirm_cancel").style.display = "none";
}
/**
 *
 * deletes subtask
 */
function deleteSubtask(index) {
  if (index >= 0 && index < subtasks.length) {
    subtasks.splice(index, 1);
    renderSubtask();
  }
}
/**
 *
 * edits subtask
 */

function editSubtask(index) {
  const subtask = subtasks[index];
  document.getElementById("task_title").value = subtask.title;
  document.getElementById("task_subtask").value = subtask.text;
  subtasks.splice(index, 1);
  renderSubtask();
}

/**
 * render subtasks
 */
function renderSubtask() {
  const subtasksContainer = document.getElementById("sub");
  subtasksContainer.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    const subtaskElement = createSubtaskElement(subtask, index);
    subtasksContainer.appendChild(subtaskElement);
  });
}

async function saveTasks() {
  try {
    await setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Saving error:", error);
  }
}

async function loadTasks() {
  try {
    const loadedTasks = await getItem("tasks");
    if (loadedTasks.data.value) {
      tasks = JSON.parse(loadedTasks.data.value);
    }
  } catch (error) {
    console.error("Loading error:", error);
  }
}

function AnimationTasksAdded() {
  let animationElement = document.getElementById("task_added");
  animationElement.classList.remove("d-none");
  
  setTimeout(() => {
    animationElement.classList.add("d-none");
    window.location.href = "board.html";
  }, 3000);
}
