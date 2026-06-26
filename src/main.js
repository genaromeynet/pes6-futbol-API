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
const btnPosiciones = document.getElementById("btnPosiciones");
const tablaPosiciones = document.getElementById("tablaPosiciones");
const mensajeFooter = document.getElementById("mensajeFooter");

let paisSeleccionado = null;
let idLigaActual = null;
let temporada = 2024;
let tabla = [];
let listaPaises;
let tablaAbierta = false;

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

  $liga.innerHTML = "";

  const placeholder = document.createElement("option"); //placeholder creado para ver "seleccionar liga"
  placeholder.value = "";
  placeholder.textContent = "Seleccionar liga";
  placeholder.selected = true;

  $liga.appendChild(placeholder);

    ligas.forEach(ligaActual => {
    const option = document.createElement("option");
      option.value = ligaActual.league.id;
      option.textContent = ligaActual.league.name;
      $liga.appendChild(option);
    });
}


function cargarEquipos(equipos, temporada) {

    $datosEquipos.innerHTML = "";

    // 🔴 normalizar SIEMPRE a array
   if (!Array.isArray(equipos)) {
        console.warn("Equipos no es array:", equipos);

        $datosEquipos.innerHTML = `
            <p class="mensaje-vacio">
                ⚠️ No se pudieron cargar los equipos (respuesta inválida de la API)
            </p>
        `;

        return;
    }

    // 🔴 si no hay datos, mostrar mensaje y salir
    if (equipos.length === 0) {
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

    <button class="btn-plantilla">
      Ver plantilla
    </button>
        `;

       const boton = card.querySelector(".btn-plantilla");

    boton.addEventListener("click", () => {
    console.log("Equipo:", equipo);
    localStorage.setItem("idEquipo", equipo.team.id);
    localStorage.setItem("equipoSeleccionado", JSON.stringify(equipo));
    window.location.href = "equipo.html";
});
    
const favBtn = document.createElement("button");
favBtn.classList.add("btn-favorito");

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

function mostrarTabla(posiciones, temporada) {

    const standings = posiciones?.response?.[0]?.league?.standings?.[0];

    tablaPosiciones.innerHTML = "";

    if (!standings || standings.length === 0) {
        tablaPosiciones.textContent = "No hay tabla disponible";
        return;
    }

    const tabla = document.createElement("table");
    tabla.classList.add("tabla-clasificacion");

    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Pos</th>
                <th>Equipo</th>
                <th>PJ</th>
                <th>PG</th>
                <th>PE</th>
                <th>PP</th>
                <th>GF</th>
                <th>GC</th>
                <th>DG</th>
                <th>Pts</th>
            </tr>
        </thead>
    `;

    const tbody = document.createElement("tbody");

    standings.forEach(equipo => {

        const fila = document.createElement("tr");

         fila.innerHTML = `
            <td>${equipo.rank}</td>
            <td>${equipo.team.name}</td>
            <td>${equipo.all.played}</td>
            <td>${equipo.all.win}</td>
            <td>${equipo.all.draw}</td>
            <td>${equipo.all.lose}</td>
            <td>${equipo.all.goals.for}</td>
            <td>${equipo.all.goals.against}</td>
            <td>${equipo.goalsDiff}</td>
            <td><strong>${equipo.points}</strong></td>
        `;

        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);

    tablaPosiciones.appendChild(tabla);
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

    const listaLigas = ligas?.response ?? ligas; // 🔥 FALTABA ESTO

    if (!listaLigas || listaLigas.length === 0) {
        $liga.innerHTML = "";
        mensajeFooter.textContent = "❌ Este país no tiene ligas disponibles";
        return;
    }


    cargarLigas(listaLigas);

});

$liga.addEventListener("change", async () => {

    const idLiga = $liga.value;

    idLigaActual = idLiga;

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

btnPosiciones.addEventListener("click", async () => {

    if (!idLigaActual) return;

    const arrow = btnPosiciones.querySelector(".arrow");

    // toggle visual flecha
    arrow.classList.toggle("rotated");

    if (tablaAbierta) {
        tablaPosiciones.innerHTML = "";
        tablaAbierta = false;
        return;
    }

    const posiciones =
        await obtenerTablaPosiciones(idLigaActual, temporada);

    mostrarTabla(posiciones);

    tablaAbierta = true;
});


//mensajes para el footer
function mensajeAyuda(elemento, mensaje) {

    elemento.addEventListener("mouseenter", () => {

        mensajeFooter.innerHTML = `
                <span>${mensaje}</span>
`;

    });

    elemento.addEventListener("mouseleave", () => {

        mensajeFooter.textContent =
            "Bienvenido a la mejor base de datos de Fútbol.";

    });

    
}

mensajeAyuda(
    $pais,
    "Seleccione un país para cargar sus ligas."
);

mensajeAyuda(
    $liga,
    "Seleccione una liga para visualizar equipos."
);

mensajeAyuda(
    btnFavoritos,
    "Presione favoritos para ver sus equipos guardados."
);

mensajeAyuda(
    btnPosiciones,
    "Presione para visualizar la tabla de posiciones."
);



