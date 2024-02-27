let users = []; /**
 * array Users
 */
let currentUser;


/**
 * Calls loadUsers
 */
async function init() {
  await loadUsers();
}

/**
 * get Users from backend
 */
async function loadUsers() {
  try {
    const loadedUsers = await getItem("users");
    if (loadedUsers.data.value) {
      users = JSON.parse(loadedUsers.data.value);
    }
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Register the User
 */
async function register() {
  const emailExists = users.some((user) => user.email === email1.value);
  const isPasswordValid = await passwordCheck();

  if (!isPasswordValid) {
    console.error("Passwort entspricht nicht den Anforderungen.");
    return;
  }

  if (emailExists) {
    console.error("E-Mail bereits registriert.");
  } else {
    AnimationUserAdded();
    users.push({
      name: name1.value,
      email: email1.value,
      password: password1.value,
    });

    await setItem("users", JSON.stringify(users));

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  }
}

/**
 * Checks wheter the User is a User (login)
 */

// ...

// ...

async function loginUser() {
  let email = document.getElementById("email2").value;
  let password = document.getElementById("password2").value;
  await loadUsers();

  let user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    // Speichere currentUser im Local Storage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.href = "summary.html";
  } else {
    alert("Falsche E-Mail-Adresse oder Passwort");
  }
}

// ...


// ...

/**
 * Guest Login
 */

function guestLogin() {
  document.getElementById("email2").value = users[2].email;
  document.getElementById("password2").value = users[2].password;
  loginUser();
}

/**
 * 
 * Checks Password
 */
async function passwordCheck() {
  let pw1 = document.getElementById("password1").value;
  let pw2 = document.getElementById("password2").value;

  if (pw1 !== pw2) {
    alert("Passwörter stimmen nicht überein!");
    return false;
  } else {
    return true;
  }
}

/**
 * Animation for Success Statement
 */
function AnimationUserAdded() {
  let animationElement = document.getElementById('success_register');

  // Entferne die Klasse "d-none"
  animationElement.classList.remove('d-none1');


  setTimeout(() => {
      animationElement.classList.add('d-none1');
  }, 2000);
}
