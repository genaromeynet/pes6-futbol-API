const contenedor = document.getElementById("favoritos");

const favoritos =
    JSON.parse(localStorage.getItem("favoritos")) || [];


favoritos.forEach(equipo => {

contenedor.innerHTML += `
        <div class="card-equipo">
            <img src="${equipo.logo}">
            <h3>${equipo.name}</h3>
        </div>
    `;
});

