//import "./style.css";
import {
  obtenerPaises,
  obtenerLigas,
  obtenerEquipos,
  obtenerTablaPosiciones
} from "./api.js";

const pais = document.getElementById("pais");
const liga = document.getElementById("liga");
const equipos = document.getElementById("equipos");

let paisSeleccionado = null;
let ligaSeleccionada = null;
let temporada = 2025;
let tabla = [];
let paises;

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
    pais.appendChild(option);
  });
}

function cargarLigas(ligasMock) {
  liga.innerHTML = "";

    ligasMock.forEach(ligaActual => {
    const option = document.createElement("option");
      option.value = ligaActual.league.id;
      option.textContent = ligaActual.league.name;
      liga.appendChild(option);
    });
}

function cargarEquipos(equiposMock) {

    equipos.innerHTML = "";

    equiposMock.forEach(equipo => {

        const card = document.createElement("div");
        card.classList.add("card-equipo");

        card.innerHTML = `
            <img src="${equipo.team.logo}" alt="${equipo.team.name}">
            <h3>${equipo.team.name}</h3>
        `;

        const boton = document.createElement("button");
        boton.textContent = "Ver plantilla";

        boton.addEventListener("click", () => {
    localStorage.setItem("idEquipo", equipo.team.id);
    window.location.href = "equipo.html"; //cambia de pagina
       });

        card.appendChild(boton);
        equipos.appendChild(card);
    });
}


const paises = await obtenerDatos(
    "paises",
    obtenerPaises
);

cargarPaises(paises);

const ligas = await obtenerDatos(
    `ligas_${pais}`,
    () => obtenerLigas(pais) //uso de funcion flecha porque recibe un parametro
);

cargarLigas(ligas);

const equipos = await obtenerDatos(
    `equipos_${idLiga}`,
    () => obtenerEquipos(idLiga)
);

cargarEquipos(equipos);


pais.addEventListener("change", () => {
    const paisSeleccionado = pais.value;

    cargarLigas(ligasMock[paisSeleccionado]);
});

liga.addEventListener("change", () => {

    const idLiga = liga.value;

    console.log("ID liga:", idLiga);
    console.log("Mock completo:", equiposMock);
    console.log("Equipos de esa liga:", equiposMock[idLiga]);

    cargarEquipos(equiposMock[idLiga]);

});




const paisesMock = [
  { name: "Argentina" },
  { name: "Brasil" },
  { name: "España" },
  { name: "Inglaterra" },
  { name: "Italia" }
];

const ligasMock = {
    Argentina: [
    {
        league:{
            id:1,
            name:"Liga Profesional"
        }
    },
    {
        league:{
            id:2,
            name:"Primera Nacional"
        }
    }
]
};

const equiposMock = {
    1: [
        {
            team: {
                id: 1,
                name: "River Plate",
                logo: "https://placehold.co/100x100"
            }
        },
        {
            team: {
                id: 2,
                name: "Boca Juniors",
                logo: "https://placehold.co/100x100"
            }
        },
        {
            team: {
                id: 3,
                name: "Racing Club",
                logo: "https://placehold.co/100x100"
            }
        }
    ],

    2: [
        {
            team: {
                id: 4,
                name: "Colón"
,
                logo: "https://placehold.co/100x100"
            }
        }
    ]
};
