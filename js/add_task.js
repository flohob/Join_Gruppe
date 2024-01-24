let contactsOpen = false;
let categoryOpen = false;
let subtasks = [];

function checkForms() {
  let checkTitle = document.getElementById("title");
  let checkDescription = document.getElementById("description");
  let checkDate = document.getElementById("date");
  let selectedCategory = document.getElementById("category");

  if (checkTitle.checkValidity()) {
    removeRequiered("title");
    if (checkDescription.checkValidity()) {
      removeRequiered("description");
      if (checkDate.checkValidity()) {
        removeRequiered("date");
        if (selectedCategory.checkValidity()) {
          removeRequiered("category");
          addTask();
        } else addRequiered("category");
      } else addRequiered("date");
    } else addRequiered("description");
  } else addRequiered("title");
}

function addRequiered(where) {
  document.getElementById(`${where}_reqiuered`).classList.remove("d-none");
  if (where === "description") {
    document
      .getElementById(`task_${where}`)
      .classList.add(`requiered_${where}`);
  } else document.getElementById(`task_${where}`).classList.add("requiered");
}

function removeRequiered(where) {
  document.getElementById(`${where}_reqiuered`).classList.add("d-none");
  if (where === "description") {
    document
      .getElementById(`task_${where}`)
      .classList.remove(`requiered_${where}`);
  } else document.getElementById(`task_${where}`).classList.remove("requiered");
}

function clearForm() {
  document.getElementById("task_title").value = "";
  document.getElementById("task_description").value = "";
  document.getElementById("task_date").value = "";
  changePrio("medium");
  document.getElementById("task_contacts").value = "";
  document.getElementById("task_category").value = "";
  document.getElementById("task_subtask").value = "";
}

function changeTextColor() {
  let dateInput = document.getElementById("task_date");
  let selectedDate = dateInput.value;

  if (selectedDate !== "") {
    dateInput.style.color = "black";
  } else {
    dateInput.style.color = "rgba(209, 209, 209, 1)";
  }
}

function changePrio(prio) {
  clearPrio();
  let selectedPrio = document.getElementById(`${prio}`);
  selectedPrio.classList.add(`${prio}`);
  selectedPrio.classList.remove(`hover_${prio}`);
  document.getElementById(`${prio}_svg`).style.fill = "white";
}

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
}

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

function openContacts(contactsContainer) {
  contactsContainer.classList.remove("d-none");
  document
    .getElementById("task_contacts")
    .setAttribute("placeholder", "Search contacts");
  contactsOpen = true;
  /* hier eine for schleife für alle kontakte einfügen */
  contactsContainer.innerHTML += renderDropdownContacts();
}

function closeContacts(contactsContainer) {
  contactsContainer.classList.add("d-none");
  document
    .getElementById("task_contacts")
    .setAttribute("placeholder", "Select contacts to assign");
  contactsOpen = false;
}

function searchContacts() {
  /* warten bis contacts fertig ist */
}

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

function openCategory(categoryContainer) {
  categoryContainer.classList.remove("d-none");
  document
    .getElementById("task_category")
    .setAttribute("placeholder", "Search category");
  /* hier eine for schleife für alle kategorien einfügen */
  categoryContainer.innerHTML += renderDropdownCategory();
  categoryOpen = true;
}

function closeCategory(categoryContainer) {
  categoryContainer.classList.add("d-none");
  document
    .getElementById("task_category")
    .setAttribute("placeholder", "Select task category");
  categoryOpen = false;
}

function searchCategory() {
  /* mit florian besprechen */
}

function toggleSubDrop() {
  let inputField = document.getElementById("task_subtask");
  if (document.activeElement === inputField) {
    document.getElementById("subtask_confirm_cancel").style.display = "flex";
  }
}

function addSubtask() {
  let text = document.getElementById("task_subtask");
  let title = document.getElementById("task_title");
  if (text.value !== "") {
    if (title.value !== "") {
      let subtask = {
        "title": title.value,
        "text": text.value,
      };
      subtasks.push(subtask);
      text.value = "";
      removeRequiered("title");
      document.getElementById("subtask_confirm_cancel").style.display = "none"
    } else {
      addRequiered("title");
    }
  }
}

function removeSubInput(){
 document.getElementById("task_subtask").value = '';
 document.getElementById("subtask_confirm_cancel").style.display = "none"
}

function renderDropdownCategory() {
  return `    <span>Technical Task</span>
              <span>User Story</span>
              `;
}

function renderDropdownContacts() {
  return `<div class="dropdown_contact">
                <div class="contact_name">
                  <svg width="42px" height="42px" xmlns="http://www.w3.org/2000/svg">
                    <!-- Äußerer Kreis -->
                    <circle cx="21px" cy="21px" r="20px" stroke="white" stroke-width="3" fill="transparent" />
                    <!-- Innerer Kreis -->
                    <circle cx="21px" cy="21px" r="19px" fill="#4589FF" />
                    <text fill="white" x="21px" y="23px"  alignment-baseline="middle" text-anchor="middle" >
                        SM
                      </text>
                  </svg>
                  <span>Sofia Müller (You)</span>
                </div>
                <img src="/assets/add_task/not_selected.png">
              </div>`;
}
