let currentEditIndex;
let contacts = [ {
  id: generateUniqueId(),
  name: "Pascal Ganglberger",
  email: "pascal@example.com",
  phone: "+49 123 456789",
  color: getRandomColor(),
}, 
{
  id: generateUniqueId(),
  name: "Florian Hobiger",
  email: "florian@example.com",
  phone: "+49 123 456789",
  color: getRandomColor(),
},];


function initContacts() {
  loadContacts();
}

async function saveContacts() {
  try {
      await setItem('contacts', JSON.stringify(contacts));
      console.log('Contacts saved successfully.');
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

  // Leere das Div, bevor du neue Kontakte hinzufügst
  contactContentDiv.innerHTML = '';

  // Iteriere über jeden Kontakt und füge das HTML dem Div hinzu
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];

    // Extrahiere die ersten Buchstaben des Vor- und Nachnamens
    const initials = contact.name.split(' ').map(word => word[0]).join('');

    const contactHtml = `
      <div class="contact" onclick="showContactInfo(${i})">
        <div>
          <svg width="56px" height="56px" xmlns="http://www.w3.org/2000/svg">
            <!-- Äußerer Kreis -->
            <circle cx="28px" cy="28px" r="25px" stroke="white" stroke-width="3" fill="transparent" />
            <!-- Innerer Kreis mit individueller Farbe -->
            <circle cx="28px" cy="28px" r="21px" fill="getRandomColor()" />
            <text class="svg_text" x="28px" y="30px" alignment-baseline="middle" text-anchor="middle">
              ${initials}
            </text>
          </svg>
        </div>
        <div>
          <span>${contact.name}</span>
          <p>${contact.email}</p>
        </div>
      </div>
    `;

    // Füge das Kontakt-HTML dem Div hinzu
    contactContentDiv.innerHTML += contactHtml;
  }
}



function showContactInfo(index) {
  const contact = contacts[index];
  const contactInfoDiv = document.querySelector('.contact_info_main');
  contactInfoDiv.innerHTML = '';

  // Fülle die "contact_info_main" mit den Informationen des ausgewählten Kontakts
  const contactInfoHtml = `
    <div class="contact_info_upper">
      <div class="Profile_picture_info">
        <svg width="56px" height="56px" xmlns="http://www.w3.org/2000/svg">
          <!-- Äußerer Kreis -->
          <circle cx="28px" cy="28px" r="25px" stroke="white" stroke-width="3" fill="transparent" />
          <!-- Innerer Kreis -->
          <circle cx="28px" cy="28px" r="21px"/>
          <text class="svg_text" x="28px" y="30px" alignment-baseline="middle" text-anchor="middle">
            ${contact.name.split(' ').map(word => word[0]).join('')}
          </text>
        </svg>
        <div>
          <h2>${contact.name}</h2>
          <div class="main_icons" onclick="editContact(${index})">
            <img src="assets/Login/edit.png"  alt="" /> <span>Edit</span>
            <img src="assets/Login/delete.png" alt="" /> <span>Delete</span>
          </div>
        </div>
      </div>
    </div>
    <div class="contact_info_lower">
      <h3>Contact Information</h3>
      <h2>Email</h2>
      <span>${contact.email}</span>
      <h2>Phone</h2>
      <span>${contact.phone}</span>
    </div>
  `;
  contactInfoDiv.innerHTML = contactInfoHtml;
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
  toggleEditOverlay();
}

function deleteContact() {
  if (confirm('Are you sure you want to delete this contact?')) {
    contacts.splice(currentEditIndex, 1);
    saveContacts();
    renderContacts();
  }
}

function sortJSON () {
  contacts.sort((a, b) => a.name[0].localeCompare(b.name[0]));
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
  if (overlay.classList.contains('d-none')) {
      overlay.classList.remove('d-none');
  } else {
      overlay.classList.add('d-none');
  }
}

