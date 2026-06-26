const contenedor = document.getElementById("favoritos");
const link = document.createElement("a");



function mostrarFavoritos() {

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    contenedor.innerHTML = "";

    if (!favoritos || favoritos.length === 0) {

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

        //boton eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "❌";
        btnEliminar.classList.add("btn-eliminar");

        btnEliminar.addEventListener("click", () => {

            let lista = JSON.parse(localStorage.getItem("favoritos")) || [];

            lista = lista.filter(f => f.id !== equipo.id);

            localStorage.setItem("favoritos", JSON.stringify(lista));

            mostrarFavoritos();
        });

        //boton ver plantilla
        const btnPlantilla = document.createElement("button");
        btnPlantilla.classList.add("btn-plantilla");
        btnPlantilla.textContent = "Ver plantilla";

        btnPlantilla.addEventListener("click", () => {

            const equipoNormalizado = { /*sirve para que la estructura del objeto sea igual a la que se guarda en main.js*/
                team: {
                    id: equipo.id,
                    name: equipo.name,
                    logo: equipo.logo
                }
            };

            localStorage.setItem("equipoSeleccionado", JSON.stringify(equipoNormalizado));
            localStorage.setItem("idEquipo", equipo.id);
            window.location.href = "equipo.html";
        });

        card.appendChild(btnEliminar);
        card.appendChild(btnPlantilla);

        contenedor.appendChild(card);
    });
};
mostrarFavoritos();