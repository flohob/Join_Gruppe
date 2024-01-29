contacts = [ {
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
    saveContacts();
    loadContacts()
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
            contacts = JSON.parse(loadedContacts.data.value);
            console.log('Contacts loaded successfully.');
        }
    } catch (error) {
        console.error('Loading error:', error);
    }
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
  }

  function generateUniqueId() {
    return Date.now().toString();
  }


function toggleOverlay() {
    var overlay = document.getElementById('overlay_addcontact_main');
    if (overlay.classList.contains('d-none')) {
        overlay.classList.remove('d-none');
    } else {
        overlay.classList.add('d-none');
    }
}


