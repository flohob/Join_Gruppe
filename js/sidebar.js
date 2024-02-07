
    function toggleEditOverlayLogout() {
        let overlay = document.getElementById('overlay_Logout');
        if (overlay.classList.contains('d-none')) {
            overlay.classList.remove('d-none');
        } else {
            overlay.classList.add('d-none');
        }
      }   

    
      function updateSvgText() {
        // Überprüfen, ob currentUser vorhanden ist
        if (currentUser) {
            const firstName = currentUser.name.charAt(0).toUpperCase();
            const lastName = currentUser.name.slice(-1).toUpperCase();
    
            // Setzen Sie den Text im SVG
            const svgTextElement = document.getElementById('svgText');
            if (svgTextElement) {
                svgTextElement.innerHTML = firstName + lastName;
            } else {
                console.error('SVG-Element nicht gefunden.');
            }
        }
    }
    
    // Rufen Sie updateSvgText beim Laden der Sidebar auf
    window.onload = function () {
        updateSvgText(currentUser);
    };
