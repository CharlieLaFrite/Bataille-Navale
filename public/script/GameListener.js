// Ajoute les listners nécessaire au jeu pour gérer tous les événement sur les grille comme la souris qui entre sur une case de la grille ou autre


// Ajoute tout les listner pour le joueur
function putListner() {
  let selectedShip = null;
  let horizontale = false;
  let lastButton;

  // Sélection du bateau
  document.querySelectorAll('.ship').forEach(ship => {
    ship.addEventListener('click', () => {
      if (!ship.hasAttribute('boat')) {
        selectedShip = {
          id: ship.id,
          size: parseInt(ship.dataset.size),
        };
      } else {
        alert("vous aves déja posé ce bateau !")
      }
    });
  });

  // Boucle sur toutes les cellules du tableau pour y ajouter les listners
  document.querySelectorAll('button[fonction="jeu"]').forEach((cell) => {

    // Evenement à l'entré de la souris
    cell.addEventListener('mouseenter', (e) => {
      if (selectedShip) {
        let btnClass = e.target.parentElement.className;
        preview(selectedShip["size"], btnClass, horizontale, "preview")
        lastButton = btnClass;
      }
    });

    // Evenement à la sorti de la souris
    cell.addEventListener('mouseout', (e) => {
      if (selectedShip) {
        lastButton = null;
        let btnClass = e.target.parentElement.className;
        preview(selectedShip["size"], btnClass, horizontale, "none")
      }
    });

    // Evenement au clique de la souris
    cell.addEventListener('click', (e) => {
      if (selectedShip && validShip) {
        newShip = true;
        let btnClass = e.target.parentElement.className;
        preview(selectedShip["size"], btnClass, horizontale, "validate");
        if (newShip) {
          document.getElementById(selectedShip["id"]).setAttribute('boat', "posed");
          selectedShip = null;
        }
      }
    })
    });

  // Gestion de la rotation des bateau
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (lastButton) {
      preview(selectedShip["size"], lastButton, horizontale, "none");
      horizontale = !horizontale;
      preview(selectedShip["size"], lastButton, horizontale, "preview");
  }
  });

  //Pour envoyer le formulaire
  document.getElementById('submit-btn').addEventListener('click', () => {
    if (checkBoat()) {
      playerReady(boatPosition);
    } else {
      document.querySelector('#validateBtn p').innerHTML = "Dispostion des bateaux incorrecte !"
    }
    
  })
}

// Listener pour l'adversaire
function putAdversListner() {
    // Boucle sur toutes les cellules du tableau
    document.querySelectorAll('button[fonction="adv"]').forEach((cell) => {
    // Evenement à l'entré de la souris sur une case de jeu
    cell.addEventListener('mouseenter', (e) => {
      if (player.turn) {
        if (e.target.getAttribute('boat') != "touched" && e.target.getAttribute('boat') != "missed") {
          let btnClass = e.target.parentElement.className;
          document.querySelector(`.${btnClass} button`).setAttribute("boat", "preview");
        }
      }
    });

    // Evenement à la sorti de la souris sur une case de jeu
    cell.addEventListener('mouseout', (e) => {
      if (player.turn) {
        if (e.target.getAttribute('boat') != "touched" && e.target.getAttribute('boat') != "missed") {
          let btnClass = e.target.parentElement.className;
          document.querySelector(`.${btnClass} button`).setAttribute("boat", "none");
        }
      }
    });

    // Evenement au clique de la souris sur une case de jeu
    cell.addEventListener('click', (e) => {
      if (player.turn) {
        if (e.target.getAttribute('boat') != "touched" && e.target.getAttribute('boat') != "missed") {
          missile(e.target.parentElement.className);
        }
      }
    });
  });
}