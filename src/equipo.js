import "./style.css";
import { obtenerPlantilla } from "./api.js";

const idEquipo = localStorage.getItem("idEquipo");
const filtroPosicion = document.getElementById("filtroPosicion");
const buscador = document.getElementById("buscador");

let jugadores = [];

const equipoGuardado = JSON.parse(localStorage.getItem("equipoSeleccionado"));
console.log("Equipo guardado:", equipoGuardado);

function mostrarEquipo(equipo) {

    const contenedor = document.getElementById("infoEquipo");

    contenedor.innerHTML = `
        <div class="equipo-header">
            <img src="${equipo.logo}" alt="${equipo.name}">
            <h2>${equipo.name}</h2>
        </div>
    `;
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
        plantilla = await obtenerPlantilla(idEquipo);

        localStorage.setItem(
            `plantilla_${idEquipo}`,
            JSON.stringify(plantilla)
        );
    }

    jugadores = plantilla[0].players;

    mostrarJugadores(jugadores);

}

cargarEquipo();

filtroPosicion.addEventListener("change", filtrarJugadores);
buscador.addEventListener("input", filtrarJugadores);

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