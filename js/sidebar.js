
    function toggleEditOverlayLogout() {
        let overlay = document.getElementById('overlay_Logout');
        if (overlay.classList.contains('d-none')) {
            overlay.classList.remove('d-none');
        } else {
            overlay.classList.add('d-none');
        }
      }   

      function updateSvgText(user) {
        // Ändere den Text im SVG entsprechend dem ersten Buchstaben des Benutzernamens
        const firstLetter = user.email.charAt(0).toUpperCase();
        document.getElementById('svgText').innerHTML = firstLetter;
    }
