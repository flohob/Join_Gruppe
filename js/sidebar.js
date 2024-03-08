/**
 * Toggle Function for Overlay Logout
 */

function toggleEditOverlayLogout() {
  let overlay = document.getElementById("overlay_Logout");
  if (overlay.classList.contains("d-none")) {
    overlay.classList.remove("d-none");
  } else {
    overlay.classList.add("d-none");
  }
}
/**
 * Toogle Function
 */

function toggleEditOverlayLogout2() {
  let overlay = document.getElementById("overlay_Logout2");
  if (overlay.classList.contains("d-none")) {
    overlay.classList.remove("d-none");
  } else {
    overlay.classList.add("d-none");
  }
}
/**
 *
 * @param  currentUser Registerd User who is login at the Moment
 * Gets Initials for Sideba
 */
function getInitialsUser(currentUser) {
  let namesSplit = currentUser.name.split(" ");
  let firstName = namesSplit[0].charAt(0);
  let lastName = namesSplit.length > 1 ? namesSplit[1].charAt(0) : " ";

  return (firstName + lastName).toUpperCase();
}
/**
 * changes the SVG TExt
 */

async function changeSVGText() {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Check if currentUser is null or undefined
  if (!currentUser) {
    document.getElementById("mobile_text").innerHTML = " ";
    document.getElementById("side_text").innerHTML = " ";
    return; // exit the function to avoid further execution
  }

  document.getElementById("mobile_text").innerHTML = getInitialsUser(currentUser);
  document.getElementById("side_text").innerHTML = getInitialsUser(currentUser);
}

document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll(".sidebar_mainlinks a");

  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      menuLinks.forEach((otherLink) => {
        otherLink.classList.remove("active");
      });
      link.classList.add("active");
    });
  });
});
