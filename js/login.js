let users = [
    
];

let currentUser;

async function init(){
    await loadUsers();
}

async function loadUsers() {
    try {
        const loadedUsers = await getItem('users');
        if (loadedUsers.data.value) {
            users = JSON.parse(loadedUsers.data.value);
        }
    } catch (e) {
        console.error('Loading error:', e);
    }
}

async function register() {
    const emailExists = users.some(user => user.email === email1.value);
    if (emailExists) {
        console.error('E-Mail bereits registriert.');
    } else {
        users.push({
            name: name1.value,
            email: email1.value,
            password: password1.value,
        });
        await setItem('users', JSON.stringify(users));
        console.log('Registrierung erfolgreich.');
        window.location.href = 'login.html';
    }
}


async function loginUser() {
    let email = document.getElementById('email2').value;
    let password = document.getElementById('password2').value;
    await loadUsers();

    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user; // Aktualisiere currentUser mit dem gefundenen Benutzer
        window.location.href = 'summary.html';
    } else {
        alert('Falsche E-Mail-Adresse oder Passwort');
    }
}



function guestLogin() {
    document.getElementById('email2').value = users[2].email;
    document.getElementById('password2').value = users[2].password;
    loginUser();
}




