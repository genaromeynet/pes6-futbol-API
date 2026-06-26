const contenedor = document.getElementById("favoritos");
const link = document.createElement("a");



function mostrarFavoritos(){

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

 contenedor.innerHTML = "";

if (!favoritos|| favoritos.length === 0) {

        contenedor.innerHTML = `
            <p class="mensaje-vacio">
                ❌ No hay equipos favoritos
            </p>
        `;
    return
    }

favoritos.forEach(equipo => {

    const card = document.createElement("div");
    card.classList.add("card-equipo");

    card.innerHTML = `
        <img src="${equipo.logo}">
        <h3>${equipo.name}</h3>
    `;

    // 🔴 BOTÓN ELIMINAR
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "❌";

    btnEliminar.addEventListener("click", () => {

        let lista = JSON.parse(localStorage.getItem("favoritos")) || [];

        lista = lista.filter(f => f.id !== equipo.id);

        localStorage.setItem("favoritos", JSON.stringify(lista));

        mostrarFavoritos();
    });

    // 🔵 BOTÓN VER PLANTILLA
    const btnPlantilla = document.createElement("button");
    btnPlantilla.classList.add("btn-plantilla");
    btnPlantilla.textContent = "Ver plantilla";

    btnPlantilla.addEventListener("click", () => {

        localStorage.setItem("idEquipo", equipo.id);
        localStorage.setItem("equipoSeleccionado", JSON.stringify(equipo));

        window.location.href = "equipo.html";
    });

    card.appendChild(btnEliminar);
    card.appendChild(btnPlantilla);

    contenedor.appendChild(card);
});
};
mostrarFavoritos();