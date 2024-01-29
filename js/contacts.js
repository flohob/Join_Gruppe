let contacts = [ {
  id: generateUniqueId(),
  name: "Pascal Ganglberger",
  email: "pascal@example.com",
  phone: "+49 123 456789",
}, 
{
  id: generateUniqueId(),
  name: "Florian Hobiger",
  email: "florian@example.com",
  phone: "+49 123 456789",
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
    phone: phoneNumber
  };
  contacts.push(newContact);
  saveContacts();
  toggleOverlay();
  loadContacts();
}


function generateUniqueId() {
  return Date.now().toString();
}

function renderContacts() {
  const contactContentDiv = document.getElementById('contact_content_2');
  // Leere das vorhandene HTML im Div
  contactContentDiv.innerHTML = '';

  // Iteriere über jeden Kontakt und füge das HTML dem Div hinzu
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const contactHtml = `
      <div class="contact">
        <h1>${contact.name}</h1>
        <p>${contact.email}</p>
      </div>
    `;

    // Füge das Kontakt-HTML dem Div hinzu
    contactContentDiv.innerHTML += contactHtml;
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