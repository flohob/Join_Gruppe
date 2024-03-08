/**
 *
 * Rendes Dropdown Contacts
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
 *
 * Renders Small Contacts at the Add Task
 */
function renderContactsSmall() {
  let smallContainer = document.getElementById(
    "rendercontacts_container_small"
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
 *
 * Creates Subtask Elements
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
 *
 * contacts toogle Function
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
  renderContactsSmall();
}
