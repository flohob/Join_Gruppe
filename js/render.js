
function renderCard(task) {
  // Funktion, um SVG für die Initialen zu generieren
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

  // Funktion, um alle Kontakt-SVGs zu generieren
  function generateContactSVGs(contacts) {
      return contacts.map(contact => generateInitialsSVG(contact)).join('');
  }

  return `<div class="card" onclick="openCard('${task.title}')" draggable="true" ondragstart="handleDragStart(event,'${task.title}')">
      <div class="task_category">${task.category}</div>
      <p class="task_title">${task.title}</p>
      <p class="task_description">${task.description}</p>
      <div>
          <svg id="progress_bar" width="128px" height="8px" xmlns="http://www.w3.org/2000/svg">
              <rect width="128px" height="8px" fill="#F4F4F4" rx="4px" ry="4px"/>
              <rect width="10%" height="100%" fill="#4589FF" rx="4px" ry="4px"/>
          </svg>
          </div>
          <div class="icons">
              ${generateContactSVGs(task.contacts)}
              </div>
          <div class="task_contacts_prio">
              <div class="task_prio">
              <img id="img_prio" src="${getPriorityImageSrc(task.priority)}">
              </div>
             
             
          </div>
      </div>
  </div>`;
}




function showInfoTasks(selectedTask) {
  const contactInitials = selectedTask.contacts ? selectedTask.contacts.map(contact => getInitials(contact)) : [];
  const contactColors = selectedTask.contacts ? selectedTask.contacts.map(contact => contact.color) : [];
  const assignedToText = contactInitials.map((initials, index) => {
    const fullName = selectedTask.contacts && selectedTask.contacts[index] ? selectedTask.contacts[index].name : '';
    const contactColor = contactColors[index] || getRandomColor();
    return `<div class="Info_contact_container">
      <div style="background-color: ${contactColor}" class="initials_info">${initials}</div> 
      <div class="info_name">${fullName}</div>
    </div>`;
  }).join('');

  const subtasksTexts = getAllSubtaskTexts(selectedTask);
  const subtasksCheckboxes = selectedTask.subtask ? selectedTask.subtask.map((subtask, index) => {
    const checkboxId = `subtaskCheckbox${index}`;
    const isChecked = subtask.completed ? 'checked' : '';
    return `<div class="subtask_info">
      <input type="checkbox" id="${checkboxId}" onclick="updateProgressBar()" ${isChecked}>
      <label for="${checkboxId}">${subtask.text}</label>
    </div>`;
}).join('') : '';

  const taskInfoHTML = `<div id="card-big" class="card_big_info">
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
      <div>
      <div class="subtasks_info_headline">Subtasks:</div>
        <span>
          ${subtasksCheckboxes}
        </span>
      </div>
    </div>
    <div class="editBTN">
      <img src="./assets/add_task/edit.png" onclick="editTask('${selectedTask.title}')">
      <img src="./assets/add_task/delete.png" onclick="deleteTask('${selectedTask.title}')">
    </div>
  </div>`;

  return taskInfoHTML;
}



 

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



function showContactsDropdown() {
  document.getElementById('dropdown_contacts2').classList.remove('d-none');
  if (!contacts || contacts.length === 0 || !Array.isArray(contacts[0]) || !tasks || tasks.length === 0) {
      return;
  }

  let container = document.getElementById('dropdown_contacts2');
  container.innerHTML = "";

  contacts[0].forEach((contact, index) => {
      if (contact && contact.name) {
          const isSelected = selectedContacts.some(selectedContact => selectedContact.name === contact.name);
          const imgSrc = isSelected ? "../assets/add_task/selected.png" : "../assets/add_task/not_selected.png";

          container.innerHTML += `<div class="dropdown_contact">
            <div class="contact_name">
              <svg width="42px" height="42px" xmlns="http://www.w3.org/2000/svg">
                <!-- Äußerer Kreis -->
                <circle cx="21px" cy="21px" r="20px" stroke="white" stroke-width="3" fill="transparent" />
                <!-- Innerer Kreis -->
                <circle cx="21px" cy="21px" r="19px" fill="${contact.color}" />
                <text fill="white" x="21px" y="23px"  alignment-baseline="middle" text-anchor="middle" >
                    ${getInitials(contact)}
                  </text>
              </svg>
              <span>${contact.name}</span>
            </div>
            <img id="contactSelect(${index})" onclick="contactSelectToggle(${index})" src="${imgSrc}">
          </div>`;
      }
  });
}


function toggleCategoryDropdown() {
  const dropdownCategory = document.getElementById('dropdown_category2');
  categoryOpen2 = !categoryOpen2; // Umkehrung des Zustands

  if (categoryOpen2) {
    dropdownCategory.classList.remove('noshowEdit');
  } else {
    dropdownCategory.classList.add('noshowEdit');
  }
}

function selectCategory2(category) {
  document.getElementById("task_category_edit").value = category;
  toggleCategoryDropdown();
}


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function getInitials2(name) {
  if (!name) return '';

  const nameParts = name.trim().split(' ');
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');

  return initials;
}


function getPriorityImageSrc(priority) {
  switch (priority) {
      case 'low':
          return 'js/assets/add_task/Priority symbols (1).png';
      case 'medium':
          return 'js/assets/add_task/Priority symbols Kopie.png';
      case 'urgent':
          return 'js/assets/add_task/Priority symbols.png';
      default:
          return 'default_image_path.png'; // Passe dies an die tatsächliche Standardbildpfad an
  }}