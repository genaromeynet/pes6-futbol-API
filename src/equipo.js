import "./style.css";
import { obtenerPlantilla } from "./api.js";

const idEquipo = localStorage.getItem("idEquipo");
const filtroPosicion = document.getElementById("filtroPosicion");
const buscador = document.getElementById("buscador");

let jugadores = [];

console.log("ID recibido:", idEquipo);


filtroPosicion.addEventListener("change", filtrarJugadores);
buscador.addEventListener("input", filtrarJugadores);

async function cargarEquipo() {

    const plantillaGuardada = localStorage.getItem(`plantilla_${idEquipo}`);

    const equipoGuardado = localStorage.setItem(
    "equipoSeleccionado",
    JSON.stringify(equipo));

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

    console.log(plantilla);

    jugadores = plantilla[0].players;

    mostrarJugadores(jugadores);

    

}

cargarEquipo();

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