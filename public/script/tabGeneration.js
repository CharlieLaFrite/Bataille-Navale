// Génère une grille de jeu pour le joueur ou l'adversaire en fonction de l'argument 'adv' (bool)


function genererTab(adv) {
    let thead = document.querySelector("thead");
    let tbody = document.querySelector("tbody");
    let topp = document.createElement("tr");
    let th = document.createElement("th");
    let cell = "cell-";
    let role = "jeu";

    // Si c'est la grille de l'adversaire, on prend les derniers `thead` et `tbody`
    if (adv) {
        let theadList = document.querySelectorAll("thead");
        let tbodyList = document.querySelectorAll("tbody");
        thead = theadList[theadList.length - 1];
        tbody = tbodyList[tbodyList.length - 1];
        cell = "Acell-";
        role = "adv";
    }

    th.innerHTML = " ";
    topp.appendChild(th);

    // Génère les lettres de colonnes (A-J)
    for (let i = 0; i < 10; i++) {
        let th = document.createElement("th");
        th.innerHTML = String.fromCharCode(65 + i);
        th.classList.add("header");
        topp.appendChild(th);
    }
    thead.appendChild(topp);

    // Génère les lignes et cellules du tableau (10x10)
    for (let i = 0; i < 10; i++) {
        let topp = document.createElement("tr");
        for (let x = 0; x < 11; x++) {
            if (x == 0) {
                // Première colonne : numérotation des lignes (1-10)
                let th = document.createElement("th");
                th.innerHTML = String(i + 1);
                th.classList.add("header");
                topp.appendChild(th);
            } else {
                // Cellule de jeu qui auront un bouton, celle de jeu
                let td = document.createElement("td");
                let btn = document.createElement("button");
                btn.setAttribute("fonction", role);
                td.classList.add(cell + (i + 1) + "_" + x);
                td.appendChild(btn);
                topp.appendChild(td);
            }
        }
        tbody.appendChild(topp);
    }
}
