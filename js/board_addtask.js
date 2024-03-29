let contactsOpen = false;
let categoryOpen = false;
let selectedContacts = [];
let subtasks = [];
let prioity = "medium";
let contacts = [];

/**
 * checks if all required Foms are filled
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
 * loads Contacts from backend
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

loadContacts();

/**
 * adds Required
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
 * Removes required
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
 * clears Forms
 */
function clearForm() {
  document.getElementById("task_title").value = "";
  document.getElementById("task_description").value = "";
  changePrio("medium");
  document.getElementById("task_contacts").value = "";
  document.getElementById("task_category").value = "";
  document.getElementById("task_subtask").innerHTML = "";
}
/**
 * changes Textcolor
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
 * changes Priority
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
 * clears Priority
 *
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
 * toogles Contact Drop
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
 * openConacts
 */
function openContacts(contactsContainer) {
  contactsContainer.classList.remove("d-none");
  document
    .getElementById("task_contacts")
    .setAttribute("placeholder", "Search contacts");
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
 * initials for Contact Dropdown
 */

function getInitials(contact) {
  let namesSplit = contact.name.split(" ");
  let firstName = namesSplit[0].charAt(0);
  let lastName = namesSplit.length > 1 ? namesSplit[1].charAt(0) : " ";

  return firstName + lastName;
}
/**
 * Contact Toogle
 */
function contactSelectToggle(i) {
  let img = document.getElementById(`contactSelect(${i})`);
  let notSelectedImg = "js/assets/add_task/not_selected.png";
  let selectedImg = "js/assets/add_task/selected.png";
  const isSelected = selectedContacts.some(
    (contact) => contact.id === contacts[0][i].id
  );
  if (!isSelected) {
    selectedContacts.push(contacts[0][i]);
    img.src = selectedImg;
  } else {
    selectedContacts = selectedContacts.filter(
      (contact) => contact.id !== contacts[0][i].id
    );
    img.src = notSelectedImg;
  }
  renderContactsSmall2();
}

/**
 * closes Contact Dropdown
 */

function closeContacts(contactsContainer) {
  contactsContainer.classList.add("d-none");
  document
    .getElementById("task_contacts")
    .setAttribute("placeholder", "Select contacts to assign");
  contactsOpen = false;
}
/**
 * Category Dropdown
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
 * Opens Category Dropdown
 */
function openCategory(categoryContainer) {
  categoryContainer.classList.remove("d-none");
  document
    .getElementById("task_category")
    .setAttribute("placeholder", "Search category");
  categoryOpen = true;
}

/**
 * closes Category Dropdown
 */

function closeCategory(categoryContainer) {
  categoryContainer.classList.add("d-none");
  document
    .getElementById("task_category")
    .setAttribute("placeholder", "Select task category");
  categoryOpen = false;
}

/**
 * select Category
 */

function selectCategory(category) {
  document.getElementById("task_category").value = category;
  toggleCatDrop();
}

/**
 * toogles Subdrop
 */

function toggleSubDrop() {
  let inputField = document.getElementById("task_subtask");
  if (document.activeElement === inputField) {
    document.getElementById("subtask_confirm_cancel").style.display = "flex";
  }
}

/**
 * Rendes ContactDropdown
 */

function renderDropdownContacts(contact, initials, i) {
  const isSelected = selectedContacts.some(
    (selectedContact) => selectedContact.id === contact.id
  );
  const imgSrc = isSelected
    ? "js/assets/add_task/selected.png"
    : "js/assets/add_task/not_selected.png";
  return `<div class="dropdown_contact">
                  <div class="contact_name">
                    <svg width="42px" height="42px" xmlns="http://www.w3.org/2000/svg">
                      <!-- Äußerer Kreis -->
                      <circle cx="21px" cy="21px" r="20px" stroke="white" stroke-width="3" fill="transparent" />
                      <!-- Innerer Kreis -->
                      <circle cx="21px" cy="21px" r="19px" fill="${contact.color}" />
                      <text fill="white" x="21px" y="23px"  alignment-baseline="middle" text-anchor="middle" >
                          ${initials}
                        </text>
                    </svg>
                    <span>${contact.name}</span>
                  </div>
                  <img id="contactSelect(${i})" onclick="contactSelectToggle(${i})" src="${imgSrc}">
                </div>`;
}

/**
 * Rendes Subtask
 */

function renderSubtask() {
  const subtasksContainer = document.getElementById("sub");
  subtasksContainer.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    const subtaskElement = createSubtaskElement(subtask, index);
    subtasksContainer.appendChild(subtaskElement);
  });
}
/**
 * creates Subtask Element
 */
function createSubtaskElement(subtask, index) {
  const subtaskElement = document.createElement("div");
  subtaskElement.classList.add("subtask");
  subtaskElement.innerHTML = `
      <div class="subtask-text">${subtask.text}</div>
      <div class="subtask-actions">
        <img src="assets/add_task/edit.png" class="edit_addtask_sub" onclick="editSubtask(${index})">
        <img src="assets/add_task/cancel_blue.png" class="btn-close" onclick="deleteSubtask(${index})">
      </div>
    `;
  return subtaskElement;
}

/**
 * Adds Subtask
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
 * Removes Subtask
 */

function removeSubInput() {
  document.getElementById("task_subtask").value = "";
  document.getElementById("subtask_confirm_cancel").style.display = "none";
}
/**
 * Deletes Subtask
 */

function deleteSubtask(index) {
  if (index >= 0 && index < subtasks.length) {
    subtasks.splice(index, 1);
    renderSubtask();
  }
}

/**
 * Edits Subtask
 */

function editSubtask(index) {
  const subtask = subtasks[index];
  document.getElementById("task_subtask").value = subtask.text;
  subtasks.splice(index, 1);
  renderSubtask();
}

/**
 * Renders Contact Small
 */

function renderContactsSmall2() {
  let smallContainer = document.getElementById(
    "rendercontacts_container_small2"
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
