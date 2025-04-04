// Ce fichier gère la sélection des bateaux, pour les poser sur la grille. Il ajoute aussi tout les listners nécessaire;


let validShip = false;
let newShip = false;
let boatPosition = [['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'], 
                   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                   ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.']];



// Prévisualisation des bateaux pour les afficher et les poser sur la grille
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
      } else {
        boatPosition[coordY-1][coordX-1] = 'X'; // Place les coordonées du bateau dans la grille
      }
    } catch {}   
  }
}

// Renvoie les coord X et Y gràce à la classe d'une cellules
function coord(clas) {
  let match = clas.match(/(?:A)?cell-(\d{1,2})_(\d{1,2})/);  // Expression régulière qui récupère 1 ou 2 chiffre pour X et Y
  return [parseInt(match[1]), parseInt(match[2])];  // Renvoie [x, y]
}

// Vérifie que tout les bateaux sont posé
function checkBoat() {
  let nbBoat = 0;
  document.querySelectorAll('[boat="validate"]').forEach(() => {
    nbBoat++;
  })
  return nbBoat === 17;
}