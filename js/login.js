let users = [
    {'email': 'guest@email.at' , 'password': 'guest'}
];

function addUser() {
    let email = document.getElementById('email1').value;
    let password = document.getElementById('password1').value;
    users.push({email: email, password: password});
    console.log(users);
    window.location.href = 'login.html'
    console.log(users);
}

//Auslagern in eine register.js
function loginUser() {
let email = document.getElementById('email2').value;
let password = document.getElementById('password2').value;

let user = users.find(u => u.email == email && u.password == password)

if(user) {
    window.location.href = 'summary.html'
} else {
    alert('Bitte registieren sie sich')
}
}

function guestlogin() {
    document.getElementById('email2').value = users[0].email;
    document.getElementById('password2').value = users[0].password;
    loginUser();
}

