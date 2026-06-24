const contenedor = document.getElementById("favoritos");

let favoritos =
    JSON.parse(localStorage.getItem("favoritos")) || [];

favoritos.forEach(equipo => {

    const card = document.createElement("div");
    card.classList.add("card-equipo");

    card.innerHTML = `
        <img src="${equipo.logo}">
        <h3>${equipo.name}</h3>
    `;

    const btn = document.createElement("button");
    btn.textContent = "❌";

    btn.addEventListener("click", () => {

        let lista =
            JSON.parse(localStorage.getItem("favoritos")) || [];

        lista = lista.filter(f => f.id !== equipo.id);

        localStorage.setItem("favoritos", JSON.stringify(lista));

        card.remove(); // ✔ ahora siempre funciona
    });

    card.appendChild(btn);
    contenedor.appendChild(card);
});