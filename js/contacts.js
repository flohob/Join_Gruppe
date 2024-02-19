let currentEditIndex;
let contacts = [];


function initContacts() {
  loadContacts();
}

async function saveContacts() {
  try {
      await setItem('contacts', JSON.stringify(contacts));
  } catch (error) {
      console.error('Saving error:', error);
  }
}

async function loadContacts() {
  try {
      const loadedContacts = await getItem('contacts');
      if (loadedContacts.data.value) {
        console.log(loadedContacts);
          contacts = JSON.parse(loadedContacts.data.value);
          console.log('Contacts loaded successfully.');
      }
  } catch (error) {
      console.error('Loading error:', error);
  }
  renderContacts();
}

function saveContact() {
  const fullName = document.getElementById('addcontact_fullname').value;
  const email = document.getElementById('addcontact_email').value;
  const phoneNumber = document.getElementById('addcontact_number').value;

  // Überprüfen, ob alle Felder ausgefüllt sind
  if (fullName && email && phoneNumber) {
    const newContact = {
      id: generateUniqueId(),
      name: fullName,
      email: email,
      phone: phoneNumber,
      color: getRandomColor(),
    };
    contacts.push(newContact);
    saveContacts();
    toggleOverlay();
    loadContacts();
    showContactInfo(contacts.length - 1); // Hier wird showContactInfo mit dem Index des neu hinzugefügten Kontakts aufgerufen
   clearButton();
  } else {
    // Zeigen Sie eine Benachrichtigung an oder tun Sie etwas anderes, um den Benutzer darauf hinzuweisen, dass alle Felder erforderlich sind
    alert('Bitte füllen Sie alle Felder aus.');
  }
}


function generateUniqueId() {
  return Date.now().toString();
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function renderContacts() {
  const contactContentDiv = document.getElementById('contact_content_2');
  sortJSON();
  contactContentDiv.innerHTML = '';
  let currentLetter = '';
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const firstLetter = contact.name[0].toUpperCase();
    if (firstLetter !== currentLetter) {
      const sectionHtml = `<div class="contact-section" id="section_${firstLetter}">
                            <h2>${firstLetter}</h2>
                          </div>`;
      contactContentDiv.innerHTML += sectionHtml;
      currentLetter = firstLetter;
    }
    const initials = contact.name.split(' ').map(word => word[0]).join('');

    const contactHtml = `
      <div class="contact" id="con${i}" onclick="showContactInfo(${i})">
        <div class="initials_pic" style="background-color: ${contact.color}">
          <span>${initials}</span>
        </div>
        <div class="info">
          <span>${contact.name}</span>
          <a href="#">${contact.email}</a>
        </div>
      </div>
    `;
    const sectionId = `section_${firstLetter}`;
    document.getElementById(sectionId).insertAdjacentHTML('beforeend', contactHtml);
  }
}



function showContactInfo(index) {
  const contact = contacts[index];
  const contactInfoDiv = document.querySelector('.contact_info_main');
  const hover = document.getElementById(`con${index}`);
  toggleOverlay_mobile();
  contactInfoDiv.innerHTML = '';
  
  // Entfernen Sie die Klasse 'current-contact' von allen Elementen
  const allContacts = document.querySelectorAll('.contact');
  allContacts.forEach(contactElement => {
    contactElement.classList.remove('current-contact');
  });

  const contactInfoHtml = `
    <div class="contact_info_upper">
      <img onclick="mobileclose()" class="mobile_back" src="assets/Login/arrow-left-line.png">
      <div class="Profile_picture_info">
        <div class="initials_pic_big" style="background-color: ${contact.color}">
          <span>${contact.name.split(' ').map(word => word[0]).join('')}</span>
        </div>
        <div class="flex_align">
          <h2>${contact.name}</h2>
          <div class="main_icons" onclick="editContact(${index})">
            <img src="assets/Login/edit.png" alt="" /> <span>Edit</span>
            <img src="assets/Login/delete.png" alt="" /> <span>Delete</span>
          </div>
        </div>
      </div>
    </div>
    <div class="contact_info_lower">
      <h3>Contact Information</h3>
      <h2>Email</h2>
      <a href="#">${contact.email}</a>
      <h2>Phone</h2>
      <span>${contact.phone}</span>
    </div>
  `;
  
  contactInfoDiv.innerHTML = contactInfoHtml;
  contactInfoDiv.classList.add('slide-in');
  
  // Fügen Sie die Klasse 'current-contact' nur zum aktuellen Element hinzu
  hover.classList.add('current-contact');

  document.getElementById('editContactInitials').textContent = contact.name.split(' ').map(word => word[0]).join('');
  document.getElementById('editContactInitialsColor').style.backgroundColor = contact.color;
}


function editContact(index) {
  const contact = contacts[index];
  console.log(contact);
  document.getElementById('editcontact_fullname').value = contact.name;
  document.getElementById('editcontact_email').value = contact.email;
  document.getElementById('editcontact_phone').value = contact.phone;
  currentEditIndex = index;
  toggleEditOverlay();

}

function saveEditedContact() {
  const editedName = document.getElementById('editcontact_fullname').value;
  const editedEmail = document.getElementById('editcontact_email').value;
  const editedPhone = document.getElementById('editcontact_phone').value;
  contacts[currentEditIndex].name = editedName;
  contacts[currentEditIndex].email = editedEmail;
  contacts[currentEditIndex].phone = editedPhone;
  saveContacts();
  renderContacts();
  showContactInfo(currentEditIndex); 
  toggleEditOverlay();
}

function deleteContact() {
  if (confirm('Are you sure you want to delete this contact?')) {
    contacts.splice(currentEditIndex, 1);
    saveContacts();
    renderContacts();
    showContactInfo(contacts.length > 0 ? 0 : null); 
    toggleEditOverlay();
  }
}

function sortJSON() {
  contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function toggleOverlay() {
  var overlay = document.getElementById('overlay_addcontact_main');
  if (overlay.classList.contains('d-none')) {
      overlay.classList.remove('d-none');
  } else {
      
      overlay.classList.add('d-none');
  }
}


function toggleEditOverlay() {
  var overlay = document.getElementById('overlay_editcontact_main');
  var overlay_content = document.getElementById('overlay_addcontact_content');
  if (overlay.classList.contains('d-none')) {
      overlay.classList.remove('d-none');
      overlay_content.classList.add('slide-in');
  } else {
      overlay.classList.add('d-none');
  }
}

function clearButton() {
document.getElementById('addcontact_fullname').value = "";
document.getElementById('addcontact_email').value = "";
document.getElementById('addcontact_number').value = "";
}

function toggleOverlay_mobile() {
  var contactContainer = document.getElementById('contact_container');
  var showInfo = document.getElementById('info_main');
  if (window.innerWidth < 1000) {
    contactContainer.classList.add('d-none');
    showInfo.classList.add('show');
  }
}

function mobileclose () {
  var contactContainer = document.getElementById('contact_container');
  var showInfo = document.getElementById('info_main');
  contactContainer.classList.remove('d-none');
    showInfo.classList.remove('show');
}

