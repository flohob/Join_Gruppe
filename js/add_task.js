let contactsOpen = false;
let categoryOpen = false;
let selectedContacts = [];
let subtasks = [];
let prioity = "medium";
let tasks= [];


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
  prioity = prio;
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
  prioity = 'medium';
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
  contactsContainer.innerHTML = "";
  for (let index = 0; index < contacts.length; index++) {
    const contact = contacts[index];
    let initials = getInitials(contact);
    contactsContainer.innerHTML += renderDropdownContacts(contact, initials, i);
  }
}

function getInitials(contact){
  let namesSplit = contact.name.split(" ")
  let firstName = namesSplit[0].charAt(0);
    let lastName = namesSplit[1].charAt(0);
    return(firstName + lastName)
}

function contactSelectToggle(i){
 let img = document.getElementById(`contactSelect(${i})`);
 let notSelectedImg = "/assets/add_task/not_selected.png";  
 let selectedImg = "/assets/add_task/selected.png";
 let activImg = notSelectedImg;

 if(activImg === notSelectedImg){
  img.src = selectedImg;
  activImg = selectedImg
  selectedContacts.push(contacts[i])
 } else {
  img.src = notSelectedImg;
  activImg = notSelectedImg;
  selectedContacts.slice(contacts[i])
 }
}

function closeContacts(contactsContainer) {
  contactsContainer.classList.add("d-none");
  document
    .getElementById("task_contacts")
    .setAttribute("placeholder", "Select contacts to assign");
  contactsOpen = false;
}

function searchContacts() {
  let input = document.getElementById('task_contacts').value.toLowerCase()
  let contactsContainer = document.getElementById("dropdown_contacts");
  contactsContainer.innerHTML = ""
  for (let index = 0; index < contacts.length; index++) {
    const contact = contacts[index].name.toLowerCase();
      if(contact.includes(input)){
        let initials = getInitials(contact)
        contactsContainer.innerHTML += renderDropdownContacts(contact, initials, index);
      }
  }
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
  categoryOpen = true;
}

function closeCategory(categoryContainer) {
  categoryContainer.classList.add("d-none");
  document
    .getElementById("task_category")
    .setAttribute("placeholder", "Select task category");
  categoryOpen = false;
}

function selectCategory(category){
document.getElementById('task_category').value = category;
toggleCatDrop()
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
      renderSubtask()
    } else {
      addRequiered("title");
      document.getElementById("subtask_confirm_cancel").style.display = "none";
    }
  }  else document.getElementById("subtask_confirm_cancel").style.display = "none";
}

function removeSubInput(){
 document.getElementById("task_subtask").value = '';
 document.getElementById("subtask_confirm_cancel").style.display = "none"
}

function addTask(){
  let description = document.getElementById('task_description').value
  let title = document.getElementById('task_title').value
  let date = document.getElementById('task_date').value
  let category = document.getElementById('task_category').value
  if(description === ""){description = 'Keine Beschreibung'}
  let task = {
    'title': title,
    'description': description,
    'date': date,
    'priority': prioity,
    'contacts': selectedContacts,
    'category': category,
    'subtask': subtasks,
    'position': 'todo',
  }
  tasks.push(task)
}

function renderDropdownContacts(contact, initials, i) {
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
                <img id="contactSelect(${i})" onclick="contactSelectToggle(${i})" src="/assets/add_task/not_selected.png">
              </div>`;
}