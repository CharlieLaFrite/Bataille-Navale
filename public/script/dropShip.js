let validShip = false;
let newShip = false;

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

  // Boucle sur toutes les cellules du tableau
  document.querySelectorAll('button[fonction="jeu"]').forEach(cell => {
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
  document.addEventListener('keydown', () => {
    if (lastButton) {
      preview(selectedShip["size"], lastButton, horizontale, "none");
      horizontale = !horizontale;
      preview(selectedShip["size"], lastButton, horizontale, "preview");
  }
  });

  //Pour envoyer le formulaire
  document.getElementById('submit-btn').addEventListener('click', () => {
    console.log("ouiuii redfirecte");
    
  })
}

// Prévisualisation des bateaux
function preview(size, btnClass, horizontale, preview) {
  let [y, x] = coord(btnClass); // Extraction des coordonnées
  validShip = true;

  // Vérification des limites en fonction de l'orientation
  if ((horizontale && x + size - 1 > 10) || (!horizontale && y + size - 1 > 10)) {
    if (preview === "preview") {
      preview = "error";
      validShip = false;
    }
  }

  // Verification qu'il n'y ai pas de bateau
  if (preview != "none")  {
    for (let i = 0; i < size; i++) {    
      try {
        let coordX = horizontale ? x + i : x;
        let coordY = horizontale ? y : y + i;
        let button = document.querySelector(`.cell-${coordY}_${coordX} button`);
        if (button.getAttribute('boat') == 'validate') {
          preview = "error";
          newShip = false;
        }
      } catch {}
    }
  }
  tempPreview = preview
  // Placement du bateau avec coordonnées dynamiques
  for (let i = 0; i < size; i++) {
    try {
      let coordX = horizontale ? x + i : x;
      let coordY = horizontale ? y : y + i;
      let button = document.querySelector(`.cell-${coordY}_${coordX} button`);
      if (button.getAttribute('boat') == 'validate') {
        tempPreview = "validate";
      }
      button.setAttribute("boat", tempPreview);
      if (preview != "validate") {
        tempPreview = preview;
      }
    } catch {}
  }
}

// Renvoie les coord X et Y gràce à la classe d'une cellules
function coord(clas) {
  let match = clas.match(/cell-(\d{1,2})_(\d{1,2})/);  // Expression régulière qui récupère 1 ou 2 chiffre pour X et Y
  return [parseInt(match[1]), parseInt(match[2])];  // Renvoie [x, y]
}
