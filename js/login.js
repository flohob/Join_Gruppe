let users = [];
/**
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
    document
      .getElementById("title_reqiuered_register_signin")
      .classList.remove("noshow");
    setTimeout(() => {
      document
        .getElementById("title_reqiuered_register_signin")
        .classList.add("noshow");
    }, 3000);
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

function displayErrorMessage() {
  document.getElementById("title_reqiuered_login").classList.remove("noshow");
  document.getElementById("email2").value = "";
  document.getElementById("password2").value = "";

  // Verstecke die Fehlermeldung nach 3 Sekunden
  setTimeout(() => {
    document.getElementById("title_reqiuered_login").classList.add("noshow");
  }, 3000);
}

// Funktion für die Anmeldung des Benutzers
async function loginUser() {
  let email = document.getElementById("email2").value;
  let password = document.getElementById("password2").value;
  let rememberMeCheckbox = document.getElementById("flexCheckDefault");
  await loadUsers();
  let user = findUser(email, password);
  if (user) {
    handleSuccessfulLogin(user, rememberMeCheckbox);
  } else {
    displayErrorMessage();
  }
  handleRememberMe();
}

/**
 * 
 *Finds User
 */
function findUser(email, password) {
  return users.find((u) => u.email === email && u.password === password);
}

// Funktion für die erfolgreiche Anmeldung
function handleSuccessfulLogin(user, rememberMeCheckbox) {
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  if (rememberMeCheckbox.checked) {
    localStorage.setItem("rememberedEmail", currentUser.email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }
  window.location.href = "summary.html";
}
/**
 * Guest Login
 */
function guestLogin() {
  document.getElementById("email2").value = users[20].email;
  document.getElementById("password2").value = users[20].password;
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
    document
      .getElementById("title_reqiuered_register")
      .classList.remove("noshow");
    setTimeout(() => {
      document
        .getElementById("title_reqiuered_register")
        .classList.add("noshow");
    }, 3000);
    return false;
  } else {
    return true;
  }
}
/**
 * Animation for Success Statement
 */
function AnimationUserAdded() {
  let animationElement = document.getElementById("success_register");

  // Entferne die Klasse "d-none"
  animationElement.classList.remove("d-none1");

  setTimeout(() => {
    animationElement.classList.add("d-none1");
  }, 2000);
}

function handleRememberMe() {
  const rememberMeCheckbox = document.getElementById("flexCheckDefault");
  const emailInput = document.getElementById("email2");

  // Beim Laden der Seite überprüfen, ob die Checkbox gespeichert ist
  const savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    rememberMeCheckbox.checked = true;
    emailInput.value = savedEmail;
  }
  rememberMeCheckbox.addEventListener("change", function () {
    if (this.checked) {
      localStorage.setItem("rememberedEmail", emailInput.value);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  });
}
