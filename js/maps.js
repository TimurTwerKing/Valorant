const BASE_URL = "https://valorant-api.com/v1";

// Función para mostrar la lista de mapas
const displayMapsList = (maps) => {
    const mapsList = document.getElementById("maps-list");
    mapsList.innerHTML = "";

    maps.forEach(map => {
        const listItem = document.createElement("li");
        listItem.classList.add("flex", "items-center", "space-x-4", "p-4", "bg-gray-800", "rounded-lg",
            "shadow-md", "hover:bg-gray-700", "cursor-pointer");

        listItem.innerHTML = ` 
        <div class="w-56 h-16 flex-shrink-0 md:w-24 lg:w-56">
         <img src="${map.listViewIcon}" alt="${map.displayName}" class="w-full h-full object-cover rounded-lg">
          </div> <div class="flex-grow md:flex-grow-0 md:flex md:items-center lg:ml-2"> 
          <span class="text-lg font-semibold text-yellow-400">${map.displayName}</span>
        </div> 
           `;

        listItem.onclick = () => displayMapDetails(map);
        mapsList.appendChild(listItem);
    });
};

// Función para mostrar los detalles de un mapa
const displayMapDetails = (map) => {
    // Ocultar imagen por defecto
    document.getElementById("default-map-image").classList.add("hidden");
    document.getElementById("map-image").classList.remove("hidden");

    // Mostrar la imagen y la displayIcon del mapa
    document.getElementById("map-image").src = map.splash || '../img/allMaps.jpg';
    document.getElementById("map-display-icon").src = map.displayIcon || '';
    document.getElementById("map-display-icon").classList.remove("hidden");

    // Ocultar la descripción predeterminada
    document.getElementById("default-map-description").classList.add("hidden");

    // Actualizar título y descripción
    document.getElementById("map-name").textContent = map.displayName;

    // Verificar la existencia de callouts y mostrarlos
    const calloutsList = document.getElementById("callouts-list");
    calloutsList.innerHTML = "";

    if (map.callouts && map.callouts.length > 0) {
        map.callouts.forEach(callout => {
            const calloutCard = document.createElement("div");
            calloutCard.classList.add("bg-gray-800", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "items-center", "hover:scale-105", "transition-transform");

            calloutCard.innerHTML =
                `<h4 class="text-yellow-400 font-bold text-lg mb-2">Region: ${callout.regionName}</h4>
                <p class="text-gray-400 text-sm mb-2"><strong>Super Region:</strong> ${callout.superRegionName}</p>
                <p class="text-gray-400 text-sm mb-2"><strong>Location (x, y):</strong> (${callout.location.x.toFixed(2)}, ${callout.location.y.toFixed(2)})</p>`;

            calloutsList.appendChild(calloutCard);
        });
    } else {
        const noCalloutsCard = document.createElement("div");
        noCalloutsCard.classList.add("bg-gray-800", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "items-center");
        noCalloutsCard.innerHTML =
            `<h4 class="text-yellow-400 font-bold text-lg mb-2">No Callouts Available</h4>
            <p class="text-gray-400 text-sm">This map doesn't have specific callouts available.</p>`;

        calloutsList.appendChild(noCalloutsCard);
    }

    // Desplazar la vista hacia el título del mapa
    document.getElementById("map-name").scrollIntoView({ behavior: "smooth", block: "center" });
};

// Fetch de mapas
const fetchMaps = async () => {
    try {
        const res = await fetch(`${BASE_URL}/maps`);
        const { data } = await res.json();

        // Logging for callouts
        data.forEach(map => {
            console.log(`Callouts for map ${map.displayName}:`, map.callouts);
        });

        displayMapsList(data);
    } catch (e) {
        console.error("Error fetching maps:", e);
    }
};

fetchMaps();
