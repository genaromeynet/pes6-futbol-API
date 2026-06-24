import "./style.css";
import { obtenerPlantilla } from "./api.js";

const idEquipo = localStorage.getItem("idEquipo");
const filtroPosicion = document.getElementById("filtroPosicion");
const buscador = document.getElementById("buscador");

let jugadores = [];

const equipoGuardado = JSON.parse(localStorage.getItem("equipoSeleccionado"));
console.log("Equipo guardado:", equipoGuardado);

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


function mostrarJugadores(jugadores) {

    const tbody = document.querySelector("#tablaJugadores tbody");

    tbody.innerHTML = "";

    jugadores.forEach(jugador => {

        tbody.innerHTML += `
            <tr>
                <td><img src="${jugador.photo}" width="40"></td>
                <td>${jugador.name}</td>
                <td>${jugador.position}</td>
                <td>${jugador.number}</td>
                <td>${jugador.age}</td>
            </tr>
        `;

    });

}

function filtrarJugadores() {

    const posicion = filtroPosicion.value;
    const nombre = buscador.value.toLowerCase();

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

    mostrarJugadores(resultado);

}

cargarEquipo();

filtroPosicion.addEventListener("change", filtrarJugadores);
buscador.addEventListener("input", filtrarJugadores);