const apiKey = import.meta.env.VITE_API_KEY;

const headers = {
  "x-apisports-key": apiKey
};

async function request(url) {
  try {
    const res = await fetch(url, { headers });

    const data = await res.json();

    if (data?.errors && Object.keys(data.errors).length > 0) {
      console.error("API ERROR:", data.errors);
      return [];
    }

    return data?.response ?? [];
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return [];
  }
}


export function obtenerPaises() {
  return request("https://v3.football.api-sports.io/countries");
}

export function obtenerLigas(pais) {
  return request(`https://v3.football.api-sports.io/leagues?country=${pais}`);
}

export function obtenerTablaPosiciones(idLiga, temporada) {
  return request(`https://v3.football.api-sports.io/standings?league=${idLiga}&season=${temporada}`);
  console.log("RESPONSE API:", data);
}

export function obtenerEquipos(idLiga, temporada) {
  return request(`https://v3.football.api-sports.io/teams?league=${idLiga}&season=${temporada}`);
}

export async function obtenerDatosEquipo(idEquipo) {
  const data = await request(
    `https://v3.football.api-sports.io/teams?id=${idEquipo}`
  );

  return data?.[0] ?? null;
}

export function obtenerJugadores(idEquipo, temporada) {
  return request(`https://v3.football.api-sports.io/players?team=${idEquipo}&season=${temporada}`);
}

export function obtenerPlantilla(idEquipo) {
  return request(`https://v3.football.api-sports.io/players/squads?team=${idEquipo}`);
}




