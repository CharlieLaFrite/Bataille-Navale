let grille = document.querySelector('.bataille-navale');
let thead = document.querySelector("thead");
let tbody = document.querySelector("tbody");
let topp = document.createElement("tr");
let th = document.createElement("th");

function genererTab(){
    th.innerHTML = " ";
    topp.appendChild(th);
    //génération du thead
    for (let i = 0; i < 10; i++) {
        let th = document.createElement("th");
        th.innerHTML = String.fromCharCode(65 + i);
        th.classList.add("header");
        topp.appendChild(th);
    }
    thead.appendChild(topp);

    for (let i = 0; i < 10; i++) {
        let topp = document.createElement("tr");
        for (let x = 0; x < 11; x++) {
            if (x == 0) {
                let th = document.createElement("th");
                th.innerHTML = String(i+1);
                th.classList.add("header");
                topp.appendChild(th);
            } else {
                let td = document.createElement("td");
                let btn = document.createElement("button");
                btn.setAttribute("fonction", "jeu");
                td.classList.add("cell-" + String(i+1) + "_" + String(x));
                td.appendChild(btn);
                topp.appendChild(td);
            }
        }
        tbody.appendChild(topp);
    }
}
