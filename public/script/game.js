// Ajoute les listners sur la grille de l'adversaire
function putAdversListner() {
    // Boucle sur toutes les cellules du tableau
    document.querySelectorAll('button[fonction="adv"]').forEach((cell) => {
    // Evenement à l'entré de la souris
    cell.addEventListener('mouseenter', (e) => {
      if (player.turn) {
        if (e.target.getAttribute('boat') != "touched" && e.target.getAttribute('boat') != "missed") {
          let btnClass = e.target.parentElement.className;
          document.querySelector(`.${btnClass} button`).setAttribute("boat", "preview");
        }
      }
    });

    // Evenement à la sorti de la souris
    cell.addEventListener('mouseout', (e) => {
      if (player.turn) {
        if (e.target.getAttribute('boat') != "touched" && e.target.getAttribute('boat') != "missed") {
          let btnClass = e.target.parentElement.className;
          document.querySelector(`.${btnClass} button`).setAttribute("boat", "none");
        }
      }
    });

    // Evenement au clique de la souris
    cell.addEventListener('click', (e) => {
      if (player.turn) {
        if (e.target.getAttribute('boat') != "touched" && e.target.getAttribute('boat') != "missed") {
          console.log("yeeeeeep Suuureree");
          missile(e.target.parentElement.className);
        }
      }
    });
  });
}