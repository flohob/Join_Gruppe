function renderCard(task) {
    return `<div class="card" onclick="openCard('${task.title}')" draggable="true" ondragstart="handleDragStart(event,'${task.title}')">
          <div class="task_category">${task.category}</div>
          <p class="task_title">${task.title}</p>
          <p class="task_description">${task.description}</p>
          <div>
          <p>2/2 Subtasks</p>
          <svg id="progress_bar" width="128px" height="8px" xmlns="http://www.w3.org/2000/svg">
              <rect width="128px" height="8px" fill="#F4F4F4" rx="4px" ry="4px"/>
              <rect width="100%" height="100%" fill="#4589FF" rx="4px" ry="4px"/>
          </svg>
          <div class="task_contacts_prio">
              <div class="task_prio">
                  <svg id="task_urgent_svg" xmlns="http://www.w3.org/2000/svg" width="45px" height="30px" fill="#FFA800" class="bi bi-pause" viewBox="0 0 16 16">
                      <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/>
                  </svg>
              </div>
          </div>
      </div>`;
  }

  function showInfoTasks(selectedTask) {
    const contactInitials = extractInitials(selectedTask);
    const contactNames = selectedTask.contacts || [];
    const assignedToText = contactInitials.map((initials, index) => {
        const fullName = contactNames[index] || '';
        return `${initials} ${fullName}`;
    }).join('<br>');
  
    const taskInfoHTML = `<div id="card-big" class="card_big_info">
        <div class="task_category_big_container">
            <div class="task_category_big">${selectedTask.category}</div>
            <img onclick="closeCardbig()" src="assets/add_task/cancel_blue.png">
        </div>
        <div class="task_title_big">${selectedTask.title}</div>
        <div class="task_description_big">${selectedTask.description}</div>
        <div class="task_date_big">
            <span>Due date:</span><span> ${selectedTask.date}</span></div>
        <div class="task_prio_big">
            <span>Priority:</span><span>${selectedTask.priority}</span></div>
        <div class="task_contacts_big">
            <span>Assigned To:</span>
            <div>${assignedToText}<br> </div>
            <div>
            <span>
            <img src="assets/add_task/not_selected.png">
            ${getAllSubtaskTexts(selectedTask)}</span>
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
  




