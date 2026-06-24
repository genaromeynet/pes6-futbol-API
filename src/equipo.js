import "./styleEquipo.css";
import { obtenerPlantilla } from "./api.js";

const idEquipo = localStorage.getItem("idEquipo");
const filtroPosicion = document.getElementById("filtroPosicion");
const buscador = document.getElementById("buscador");
const ordenJugadores = document.getElementById("orden")
const btnLimpiar = document.getElementById("btnLimpiar");

let jugadores = [];


const equipoGuardado = JSON.parse(localStorage.getItem("equipoSeleccionado"));
console.log("Equipo guardado:", equipoGuardado);

function mostrarJugadores(jugadores) {

   const contenedor = document.getElementById("contenedorJugadores");
    const mensaje = document.getElementById("mensajeBusqueda");

    contenedor.innerHTML = "";


if (jugadores.length === 0) {
    mensaje.textContent = "🔍 No se encontraron jugadores.";
} else {
    mensaje.textContent = "";
}


    jugadores.forEach(jugador => {

        contenedor.innerHTML += `
             <div class="card-jugador ${jugador.position.toLowerCase()}">

                <img
                    src="${jugador.photo}"
                    alt="${jugador.name}"
                >

                <h3>${jugador.name}</h3>

                <p>⚽ ${jugador.position}</p>

                <p>🎂 ${jugador.age} años</p>

                <p>🔟 ${jugador.number ?? "-"}</p>

            </div>
        `;

    });

}

async function cargarEquipo() {

    if (equipoGuardado) {
    mostrarEquipo(equipoGuardado);}

    const plantillaGuardada = localStorage.getItem(`plantilla_${idEquipo}`);

    let plantilla;

    if (plantillaGuardada) {

        console.log("📦 Datos obtenidos del localStorage");
        plantilla = JSON.parse(plantillaGuardada);

    } else {

        console.log("🌐 Consultando la API");
        console.log("idEquipo:", idEquipo);
        plantilla = await obtenerPlantilla(idEquipo);

        console.log("Plantilla:", plantilla);

        localStorage.setItem(
            `plantilla_${idEquipo}`,
            JSON.stringify(plantilla)
        );
    }

    console.log("idEquipo:", idEquipo);
console.log("plantilla:", plantilla);
console.log("plantilla[0]:", plantilla[0])
    jugadores = plantilla[0].players;

    mostrarJugadores(jugadores);

}

function mostrarEquipo(equipo) {

    const contenedor = document.getElementById("infoEquipo");

    contenedor.innerHTML = `
        <div class="equipo-header">
            <img src="${equipo.team.logo}" alt="${equipo.team.name}">
            <h2>${equipo.team.name}</h2>
        </div>
    `;
}


function filtrarJugadores() {

    const posicion = filtroPosicion.value;
    const nombre = buscador.value.toLowerCase();
    const orden = ordenJugadores.value

    let resultado = jugadores;

    if (posicion !== "Todos") {
        resultado = resultado.filter(jugador =>
            jugador.position === posicion
        );
    }

    if (nombre !== "") {
        resultado = resultado.filter(jugador =>
            jugador.name.toLowerCase().includes(nombre)
        );
    }

    switch (orden) {

        case "edadAsc":
            resultado.sort((a, b) => a.age - b.age);
            break;

        case "edadDesc":
            resultado.sort((a, b) => b.age - a.age);
            break;

        case "numeroAsc":
            resultado.sort((a, b) => (a.number ?? 999) - (b.number ?? 999));
            break;

        case "numeroDesc":
            resultado.sort((a, b) => (b.number ?? -1) - (a.number ?? -1));
            break;
    }



    mostrarJugadores(resultado);

}

cargarEquipo();

btnLimpiar.addEventListener("click", () => {

    buscador.value = "";
    filtroPosicion.value = "Todos";
    ordenJugadores.value = "ninguno";

   filtrarJugadores();
});

filtroPosicion.addEventListener("change", filtrarJugadores);
buscador.addEventListener("input", filtrarJugadores);
ordenJugadores.addEventListener("change", filtrarJugadores);
