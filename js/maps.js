// URL base de la API
const BASE_URL = "https://valorant-api.com/v1";

// Muestra o elimina el indicador de carga en la lista de mapas
const setLoading = (isLoading) => {
    const mapsList = document.getElementById("maps-list");
    if (isLoading) {
        // Muestra un spinner de carga
        mapsList.innerHTML = `
            <div class="flex justify-center items-center p-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>`;
    }
};

// Renderiza la lista de mapas en la página
const displayMapsList = (maps) => {
    const mapsList = document.getElementById("maps-list");
    mapsList.innerHTML = "";

    // Verifica si no hay mapas disponibles
    if (!maps || maps.length === 0) {
        mapsList.innerHTML = `
            <div class="text-center p-4 text-gray-600 dark:text-gray-400">
                No maps available at the moment.
            </div>`;
        return;
    }

    // Itera sobre los mapas y crea elementos para cada uno
    maps.forEach(map => {
        const listItem = document.createElement("li");
        listItem.classList.add(
            "flex",
            "items-center",
            "space-x-4",
            "p-4",
            "bg-white",
            "dark:bg-gray-800",
            "rounded-lg",
            "shadow-md",
            "hover:bg-gray-200",
            "dark:hover:bg-gray-700",
            "cursor-pointer",
            "transition-all",
            "duration-200"
        );

        // Contenido del elemento de la lista
        listItem.innerHTML = `
            <div class="w-48 h-16 md:w-20 lg:w-56 flex-shrink-0 object-contain">
                <img src="${map.listViewIconTall}" 
                     alt="${map.displayName}"
                     aria-label="Map thumbnail for ${map.displayName}"
                     class="w-full h-full object-cover rounded-lg"
                     onerror="this.src='../img/allMaps.jpg'">
            </div>
            <div class="flex-grow md:flex-grow-0 md:flex md:items-center lg:ml-2">
                <span class="text-lg font-semibold text-yellow-500 dark:text-yellow-400">
                    ${map.displayName}
                </span>
            </div>`;

        // Configura el evento de clic para mostrar detalles del mapa
        listItem.onclick = () => displayMapDetails(map);
        mapsList.appendChild(listItem);
    });
};

// Muestra los detalles de un mapa seleccionado
const displayMapDetails = (map) => {
    const defaultImage = document.getElementById("default-map-image");
    const mapImage = document.getElementById("map-image");
    const mapDisplayIcon = document.getElementById("map-display-icon");
    const defaultDescription = document.getElementById("default-map-description");

    // Cambia entre la imagen predeterminada y la del mapa
    defaultImage.classList.add("hidden");
    mapImage.classList.remove("hidden");

    // Aplica una transición de opacidad a la imagen del mapa
    mapImage.classList.add("opacity-0");
    mapImage.src = map.splash || '../img/allMaps.jpg';
    mapImage.onload = () => mapImage.classList.remove("opacity-0");

    // Muestra o esconde el ícono del mapa si está disponible
    if (mapDisplayIcon) {
        mapDisplayIcon.src = map.displayIcon || '';
        mapDisplayIcon.classList.toggle("hidden", !map.displayIcon);
    }

    // Oculta la descripción predeterminada y actualiza el nombre del mapa
    defaultDescription.classList.add("hidden");
    document.getElementById("map-name").textContent = map.displayName;

    // Renderiza los puntos de interés (callouts) del mapa
    displayCallouts(map);

    // Desplaza la vista al nombre del mapa
    document.getElementById("map-name").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
};

// Renderiza los callouts (puntos de interés) del mapa seleccionado
const displayCallouts = (map) => {
    const calloutsList = document.getElementById("callouts-list");
    calloutsList.innerHTML = "";

    // Verifica si hay callouts disponibles
    if (map.callouts?.length) {
        map.callouts.forEach(callout => {
            const calloutCard = document.createElement("div");
            calloutCard.classList.add(
                "bg-gray-100",
                "dark:bg-gray-700",
                "p-4",
                "rounded-lg",
                "shadow-md",
                "flex",
                "flex-col",
                "items-center",
                "hover:scale-105",
                "transition-transform",
                "duration-200"
            );

            // Contenido del callout
            calloutCard.innerHTML = `
                <h4 class="text-orange-500 dark:text-orange-400 font-bold text-lg mb-2">
                    ${callout.regionName}
                </h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    <strong>Super Region:</strong> ${callout.superRegionName}
                </p>
                <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    <strong>Location (x, y):</strong> (${callout.location.x.toFixed(2)}, ${callout.location.y.toFixed(2)})
                </p>`;

            calloutsList.appendChild(calloutCard);
        });
    } else {
        // Mensaje cuando no hay callouts
        calloutsList.innerHTML = `
            <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center col-span-full">
                <h4 class="text-orange-500 dark:text-orange-400 font-bold text-lg mb-2">
                    No Callouts Available
                </h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm">
                    This map doesn't have specific callouts available.
                </p>
            </div>`;
    }
};

// Realiza una solicitud para obtener los mapas desde la API
const fetchMaps = async () => {
    setLoading(true); // Activa el indicador de carga
    try {
        const res = await fetch(`${BASE_URL}/maps`);
        if (!res.ok) throw new Error('Failed to fetch maps');
        const { data } = await res.json();
        displayMapsList(data); // Muestra la lista de mapas
    } catch (e) {
        console.error("Error fetching maps:", e);
        // Muestra un mensaje de error en caso de fallo
        document.getElementById("maps-list").innerHTML = `
            <div class="text-red-500 dark:text-red-400 p-4 text-center">
                Failed to load maps. Please try again later.
            </div>`;
    } finally {
        setLoading(false); // Desactiva el indicador de carga
    }
};

// Llama a la función para cargar los mapas al inicio
fetchMaps();
