import "./style.css";
import {
  obtenerPaises,
  obtenerLigas,
  obtenerEquipos,
  obtenerTablaPosiciones
} from "./api.js";

const $pais = document.getElementById("pais");
const $liga = document.getElementById("liga");
const $datosEquipos = document.getElementById("equipos");
const btnFavoritos = document.getElementById("btnFavoritos");

let paisSeleccionado = null;
let ligaSeleccionada = null;
let temporada = 2024;
let tabla = [];
let listaPaises;

async function obtenerDatos(clave, funcionAPI) {

    const datosGuardados = localStorage.getItem(clave);

    if (datosGuardados) {

        console.log(`${clave} desde localStorage`);

        return JSON.parse(datosGuardados);
    }

    console.log(`${clave} desde la API`);

    const datos = await funcionAPI();

    localStorage.setItem(clave, JSON.stringify(datos));

    return datos;
}


function cargarPaises(paises) {

  paises.forEach(p => {
    const option = document.createElement("option");
    option.value = p.name;
    option.textContent = p.name;
    $pais.appendChild(option);
  });
}

function cargarLigas(ligas) {
  liga.innerHTML = "";

    ligas.forEach(ligaActual => {
    const option = document.createElement("option");
      option.value = ligaActual.league.id;
      option.textContent = ligaActual.league.name;
      $liga.appendChild(option);
    });
}


function cargarEquipos(equipos, temporada) {

    $datosEquipos.innerHTML = "";

    if (!equipos || equipos.length === 0) {

        $datosEquipos.innerHTML = `
            <p class="mensaje-vacio">
                ❌ No hay equipos disponibles en esta liga
            </p>
        `;

        return;
    }

    equipos.forEach(equipo => {

        const card = document.createElement("div");
        card.classList.add("card-equipo");

        card.innerHTML = `
            <img src="${equipo.team.logo}" alt="${equipo.team.name}">
            <h3>${equipo.team.name}</h3>
        `;

        const boton = document.createElement("button");
        boton.textContent = "Ver plantilla";

    boton.addEventListener("click", () => {
    console.log("Equipo:", equipo);
    localStorage.setItem("idEquipo", equipo.team.id);
    localStorage.setItem("equipoSeleccionado", JSON.stringify(equipo));
    window.location.href = "equipo.html";
});
    
const favBtn = document.createElement("button");

function actualizarEstrella() {

    if (esFavorito(equipo.team.id)) {
        favBtn.textContent = "⭐";
    } else {
        favBtn.textContent = "☆";
    }
}

actualizarEstrella();

favBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    let favoritos =
        JSON.parse(localStorage.getItem("favoritos")) || [];

    const existe = favoritos.some(f => f.id === equipo.team.id);

    if (existe) {
        favoritos = favoritos.filter(f => f.id !== equipo.team.id);
    } else {
        favoritos.push(equipo.team);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    actualizarEstrella(); // 🔥 actualiza la UI
});

        card.appendChild(boton);
        card.appendChild(favBtn);
        $datosEquipos.appendChild(card);
    });
}

function resetFiltros() {
    $pais.value = "";
    $liga.value = "";
    $buscador.value = "";
    $liga.innerHTML = `<option value="">Seleccionar liga</option>`;
}

function agregarFavorito(equipo) {

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    const existe = favoritos.some(fav => fav.id === equipo.id);

    if (!existe) {
        favoritos.push(equipo);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function esFavorito(id) {

    let favoritos =
        JSON.parse(localStorage.getItem("favoritos")) || [];

    return favoritos.some(fav => fav.id === id);
}



  const paises = await obtenerDatos("paises", obtenerPaises);

    cargarPaises(paises);

    $pais.addEventListener("change", async () => {
    paisSeleccionado = $pais.value;

    $datosEquipos.innerHTML = "";

    const ligas = await obtenerDatos(
        `ligas_${paisSeleccionado}`,
        () => obtenerLigas(paisSeleccionado)
    );

    cargarLigas(ligas);
});

$liga.addEventListener("change", async () => {
  console.log("Cambió la liga");
    const idLiga = $liga.value;

    const equipos = await obtenerDatos(
        `equipos_${idLiga}_${temporada}`,
        () => obtenerEquipos(idLiga, temporada)
    );
    console.log(equipos);

    cargarEquipos(equipos);

    resetFiltros();

});

btnFavoritos.addEventListener("click", () => {
    window.location.href = "favoritos.html";
});
