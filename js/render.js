/**
 * generates a Initial SVG for each Contact
 */
function generateInitialsSVG(contact) {
  return `<svg width="42px" height="42px" xmlns="http://www.w3.org/2000/svg">
      <!-- Äußerer Kreis -->
      <circle cx="21px" cy="21px" r="20px" stroke="white" stroke-width="3" fill="transparent" />
      <!-- Innerer Kreis -->
      <circle cx="21px" cy="21px" r="19px" fill="${contact.color}" />
      <text fill="white" x="21px" y="23px" alignment-baseline="middle" text-anchor="middle">
          ${getInitials2(contact.name)}
      </text>
  </svg>`;
}

/**
 * Help Function for SVGS
 */
function generateContactSVGs(contacts) {
  const maxContactsToShow = 3;

  if (contacts.length <= maxContactsToShow) {
    // Wenn es 3 oder weniger Kontakte gibt, zeige alle SVGs an
    return contacts.map((contact) => generateInitialsSVG(contact)).join("");
  } else {
    // Wenn es mehr als 3 Kontakte gibt, zeige "+3" an
    const displayedContacts = contacts.slice(0, maxContactsToShow);
    const additionalContactsCount = contacts.length - maxContactsToShow;

    const displayedContactSVGs = displayedContacts
      .map((contact) => generateInitialsSVG(contact))
      .join("");
    const additionalContactsSVG = `<div class="additional-contacts">+${additionalContactsCount}</div>`;

    return `${displayedContactSVGs}${additionalContactsSVG}`;
  }
}

/**
 * Generates Progressbar
 */
function generateProgressBar(task) {
  if (!task.subtask || task.subtask.length === 0) {
    return ""; // Wenn es keine Subtasks gibt, wird keine ProgressBar generiert.
  }

  const completionPercentage = calculateCompletionPercentage(task);

  return `<svg id="${task.title}_progress_bar" width="128px" height="8px" xmlns="http://www.w3.org/2000/svg">
      <rect width="128px" height="8px" fill="#F4F4F4" rx="4px" ry="4px"/>
      <rect width="${completionPercentage}%" height="100%" fill="#4589FF" rx="4px" ry="4px"/>
  </svg>`;
}

/**
 * caclulating Progressbar
 */

function calculateCompletionPercentage(task) {
  if (!task.subtask || task.subtask.length === 0) {
    return 0; // Wenn es keine Subtasks gibt, ist der Fortschritt 0%.
  }
  const totalSubtasks = task.subtask.length;
  const completedSubtasks = task.subtask.filter(
    (subtask) => subtask.checked === true
  );
  return (completedSubtasks.length / totalSubtasks) * 100;
}

/**
 *
 * renders the Tasks in the Board
 */
function renderCard(task) {
  const contactSVGs = generateContactSVGs(task.contacts);
  const progressBarSVG = generateProgressBar(task);

  return `
  <div class="card" onclick="openCard('${
    task.title
  }')" draggable="true" ondragstart="handleDragStart(event,'${task.title}')">
  <div class="moveto">
  <img src="js/assets/add_task/add.png"  onclick="openMoveOverlay('${
    task.title
  }')">
  </div>
      <div class="task_category">${task.category}</div>
      <p class="task_title">${task.title}</p>
      <p class="task_description">${task.description}</p>
      <div>
          ${progressBarSVG}
      </div>
      <div class="icons">
          ${contactSVGs}
      </div>
      <div class="task_contacts_prio">
          <div class="task_prio">
              <img id="img_prio" src="${getPriorityImageSrc(task.priority)}">
          </div>
      </div>
  </div>
  
  <div id="moveOverlay" class="overlay_logout3 d-none">
  <div>
  <img src="js/assets/add_task/cancel_blue.png" onclick="closeMoveOverlay()">
  </div>
  <div class="overlay-content">
    <a id="moveToDoButton" class="overlay-button">Move to Todo</a>
    <a id="moveInProgressButton" class="overlay-button">Move to In Progress</a>
    <a id="moveAwaitFeedbackButton" class="overlay-button">Move to Await Feedback</a>
    <a id="moveDoneButton" class="overlay-button">Move to Done</a>
  </div>
</div>`;
}

/**
 *
 * Gets Initals and Colors for the Dropdown
 */
function getContactInitialsAndColors(selectedTask) {
  const contactInitials = selectedTask.contacts
    ? selectedTask.contacts.map((contact) => getInitials(contact))
    : [];
  const contactColors = selectedTask.contacts
    ? selectedTask.contacts.map((contact) => contact.color)
    : [];
  return { contactInitials, contactColors };
}
/**
 *
 * creates the Assigned to
 */
function getAssignedToText(contactInitials, contactColors, selectedTask) {
  return contactInitials
    .map((initials, index) => {
      const fullName =
        selectedTask.contacts && selectedTask.contacts[index]
          ? selectedTask.contacts[index].name
          : "";
      const contactColor = contactColors[index] || getRandomColor();
      return `<div class="Info_contact_container">
      <div style="background-color: ${contactColor}" class="initials_info">${initials}</div> 
      <div class="info_name">${fullName}</div>
    </div>`;
    })
    .join("");
}

/**
 *
 * Renders Checkboxes for onclicking
 */
function getSubtasksCheckboxes(selectedTask) {
  return selectedTask.subtask
    ? selectedTask.subtask
        .map((subtask, index) => {
          const imgSrc = selectedTask.subtask[index].checked
            ? "js/assets/add_task/selected.png"
            : "js/assets/add_task/not_selected.png";
          return `<div class="subtask_info">
  <img src="${imgSrc}" id="subtask_image_${index}" onclick="toggleSubtaskStatus(${index}, '${selectedTask.title}')">
  <label>${subtask.text}</label>
</div>`;
        })
        .join("")
    : "";
}

/**
 *
 * Toogles Subtask status
 */

function toggleSubtaskStatus(i, selectedTaskTitle) {
  const selectedTask = tasks.find((task) => task.title === selectedTaskTitle);
  if (!selectedTask || !selectedTask.subtask) return;

  const subtaskImageElement = document.getElementById(`subtask_image_${i}`);
  const notSelectedImg = "js/assets/add_task/not_selected.png";
  const selectedImg = "js/assets/add_task/selected.png";

  const isSelected = selectedTask.subtask[i].checked;

  if (!isSelected) {
    selectedTask.subtask[i].checked = true;
    subtaskImageElement.src = selectedImg;
  } else {
    selectedTask.subtask[i].checked = false;
    subtaskImageElement.src = notSelectedImg;
  }

  // Aktualisiere die Anzeige der Progressbar
  updateProgressBarWidth(selectedTaskTitle);
  saveTasks();
}
/**
 *
 * Updates Progressbar
 */

function updateProgressBarWidth(selectedTaskTitle) {
  const selectedTask = tasks.find((task) => task.title === selectedTaskTitle);
  if (!selectedTask || !selectedTask.subtask) return;

  const totalSubtasks = selectedTask.subtask.length;
  const completedSubtasks = selectedTask.subtask.filter(
    (subtask) => subtask.checked === true
  );

  const progressBarElement = document.getElementById(
    `${selectedTask.title}_progress_bar`
  );
  if (progressBarElement) {
    const secondRect = progressBarElement.querySelector("rect:nth-child(2)");
    if (secondRect) {
      const completionPercentage =
        totalSubtasks === 0
          ? 0
          : (completedSubtasks.length / totalSubtasks) * 100;
      secondRect.setAttribute("width", `${completionPercentage}%`);
    }
  }
}
/**
 *
 * Calls the Info
 */
function showInfoTasks(selectedTask) {
  const { contactInitials, contactColors } =
    getContactInitialsAndColors(selectedTask);
  const assignedToText = getAssignedToText(
    contactInitials,
    contactColors,
    selectedTask
  );
  const subtasksCheckboxes = getSubtasksCheckboxes(selectedTask);
  const taskInfoHTML = getTaskInfoHTML(
    selectedTask,
    assignedToText,
    subtasksCheckboxes
  );
  return taskInfoHTML;
}
/**
 * Creates EditSubtasks
 */
function createEditSubtaskElement(subtask, index) {
  const subtaskElement = document.createElement("div");
  subtaskElement.classList.add("subtask");
  subtaskElement.innerHTML = `
    <div class="subtask-text">${subtask.text}</div>
    <div class="subtask-actions">
      <img src="./assets/add_task/edit.png" class="edit_addtask_sub" onclick="editEditSubtask(${index})">
      <img src="./assets/add_task/cancel_blue.png" class="btn-close" onclick="deleteEditSubtask(${index})">
    </div>
  `;
  return subtaskElement;
}
/**
 * creates Contact SVGS
 */
function createContactSVG(contact) {
  return `<svg width="42px" height="42px" xmlns="http://www.w3.org/2000/svg">
      <!-- Äußerer Kreis -->
      <circle cx="21px" cy="21px" r="20px" stroke="white" stroke-width="3" fill="transparent" />
      <!-- Innerer Kreis -->
      <circle cx="21px" cy="21px" r="19px" fill="${contact.color}" />
      <text fill="white" x="21px" y="23px"  alignment-baseline="middle" text-anchor="middle">
          ${getInitials(contact)}
      </text>
  </svg>`;
}
/**
 * creates Contact Elements
 */
function createContactElement(contact, index, isSelected, imgSrc) {
  return `<div class="dropdown_contact">
      <div class="contact_name">
          ${createContactSVG(contact)}
          <span>${contact.name}</span>
      </div>
      <img id="contactSelect(${index})" onclick="contactSelectToggle(${index})" src="${imgSrc}">
  </div>`;
}

/**
 * Shows Contacts Dropdown
 */

function showContactsDropdown() {
  const dropdownContactsElement = document.getElementById("dropdown_contacts2");
  dropdownContactsElement.classList.remove("d-none");

  if (
    !contacts ||
    contacts.length === 0 ||
    !Array.isArray(contacts[0]) ||
    !tasks ||
    tasks.length === 0
  ) {
    return;
  }
  dropdownContactsElement.innerHTML = "";
  contacts[0].forEach((contact, index) => {
    if (contact && contact.name) {
      const isSelected = selectedContacts.some(
        (selectedContact) => selectedContact.name === contact.name
      );
      const imgSrc = isSelected
        ? "js/assets/add_task/selected.png"
        : "js/assets/add_task/not_selected.png";

      dropdownContactsElement.innerHTML += createContactElement(
        contact,
        index,
        isSelected,
        imgSrc
      );
    }
  });
}
/**
 * toogles Dropdown for Category
 */

function toggleCategoryDropdown() {
  const dropdownCategory = document.getElementById("dropdown_category2");
  categoryOpen2 = !categoryOpen2; // Umkehrung des Zustands

  if (categoryOpen2) {
    dropdownCategory.classList.remove("noshowEdit");
  } else {
    dropdownCategory.classList.add("noshowEdit");
  }
}
/**
 * Selectes Category
 */

function selectCategory2(category) {
  document.getElementById("task_category_edit").value = category;
  toggleCategoryDropdown();
}

/**
 * gets Random Color for Contacts without color
 */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
/**
 * Gets Initals
 */
function getInitials2(name) {
  if (!name) return "";

  const nameParts = name.trim().split(" ");
  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials;
}
/**
 * Gets Priority Image
 */

function getPriorityImageSrc(priority) {
  switch (priority) {
    case "low":
      return "js/assets/add_task/Priority symbols (1).png";
    case "medium":
      return "js/assets/add_task/Priority symbols Kopie.png";
    case "urgent":
      return "js/assets/add_task/Priority symbols.png";
    default:
      return "default_image_path.png"; 
  }
}
/**
 * gets HTML for info
 */
function getTaskInfoHTML(selectedTask, assignedToText) {
  const subtasksCheckboxes = getSubtasksCheckboxes(selectedTask);

  return `<div id="card-big" class="card_big_info">
    <div class="task_category_big_container">
      <div class="task_category_big">${selectedTask.category}</div>
      <img onclick="closeCardbig()" src="assets/add_task/cancel_blue.png">
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
      <div>${assignedToText}</div>
    </div>
    <div class="subtasks_info_headline">Subtasks:</div>
    <span>
      ${subtasksCheckboxes}
    </span>
    <div class="editBTN">
      <img src="./assets/add_task/edit.png" onclick="editTask('${selectedTask.title}')">
      <img src="./assets/add_task/delete.png" onclick="deleteTask('${selectedTask.title}')">
    </div>
  </div>`;
}
