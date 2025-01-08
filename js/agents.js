// URL base para las solicitudes de la API
const BASE_URL = "https://valorant-api.com/v1";

// Muestra o elimina el indicador de carga en la lista de agentes
const setLoading = (isLoading) => {
    const agentsList = document.getElementById("agents-list");
    if (isLoading) {
        // Muestra un spinner de carga mientras se obtienen los datos
        agentsList.innerHTML = `
            <div class="flex justify-center items-center p-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 dark:border-red-400"></div>
            </div>`;
    }
};

// Renderiza la lista de agentes en la página
const displayAgentsList = (agents) => {
    const agentsList = document.getElementById("agents-list");
    agentsList.innerHTML = "";

    // Verifica si no hay agentes disponibles
    if (!agents || agents.length === 0) {
        agentsList.innerHTML = `
            <div class="text-center p-4 text-gray-600 dark:text-gray-400">
                No agents available at the moment.
            </div>`;
        return;
    }

    // Itera sobre los agentes y crea elementos para cada uno
    agents.forEach(agent => {
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
            "hover:bg-gray-100",
            "dark:hover:bg-gray-700",
            "cursor-pointer",
            "transition-all",
            "duration-200"
        );

        // Contenido del elemento de la lista
        listItem.innerHTML = `
            <img src="${agent.displayIconSmall}" 
                 alt="${agent.displayName}" 
                 class="w-16 h-16 object-cover rounded-lg"
                 onerror="this.src='../img/allAgents.jpg'">
            <div>
                <span class="text-lg font-semibold text-red-500 dark:text-red-400">
                    ${agent.displayName}
                </span>
                <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    ${agent.developerName}
                </p>
            </div>
        `;

        // Configura el evento de clic para mostrar detalles del agente
        listItem.onclick = () => displayAgentDetails(agent);
        agentsList.appendChild(listItem);
    });
};

// Muestra los detalles de un agente seleccionado
const displayAgentDetails = (agent) => {
    // Oculta los elementos predeterminados y muestra los específicos del agente
    document.getElementById("default-image").classList.add("hidden");
    document.getElementById("agent-image").classList.remove("hidden");
    document.getElementById("default-description").classList.add("hidden");
    document.getElementById("agent-description").classList.remove("hidden");

    // Actualiza el nombre del agente
    document.getElementById("agent-name").textContent = agent.displayName;

    // Cambia la imagen del agente con una transición de opacidad
    const agentImage = document.getElementById("agent-image");
    agentImage.classList.add("opacity-0");
    agentImage.src = agent.fullPortrait || '../img/allAgents.jpg';
    agentImage.onload = () => agentImage.classList.remove("opacity-0");

    // Muestra la descripción del agente
    document.getElementById("agent-description").textContent =
        agent.description || 'No description available for this agent.';

    // Renderiza las habilidades del agente
    displayAbilities(agent.abilities);

    // Desplaza la vista al nombre del agente
    document.getElementById("agent-name").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
};

// Renderiza las habilidades del agente seleccionado
const displayAbilities = (abilities) => {
    const abilitiesList = document.getElementById("abilities-list");
    abilitiesList.innerHTML = "";

    // Verifica si no hay habilidades disponibles
    if (!abilities || abilities.length === 0) {
        abilitiesList.innerHTML = `
            <div class="col-span-full text-center p-4 text-gray-600 dark:text-gray-400">
                No abilities available for this agent.
            </div>`;
        return;
    }

    // Itera sobre las habilidades y crea tarjetas para cada una
    abilities.forEach(ability => {
        const abilityCard = document.createElement("div");
        abilityCard.classList.add(
            "bg-white",
            "dark:bg-gray-800",
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

        // Contenido de la tarjeta de habilidad
        abilityCard.innerHTML = `
            <img src="${ability.displayIcon}" 
                 alt="${ability.displayName}" 
                 class="w-12 h-12 object-cover rounded-full mb-2"
                 onerror="this.src='../img/ability-placeholder.jpg'">
            <h4 class="text-red-500 dark:text-red-400 font-bold text-lg mb-2">
                ${ability.displayName}
            </h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
                <strong>Slot:</strong> ${ability.slot}
            </p>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
                ${ability.description}
            </p>
        `;

        abilitiesList.appendChild(abilityCard);
    });
};

// Realiza una solicitud para obtener los agentes desde la API
const fetchAgents = async () => {
    setLoading(true); // Activa el indicador de carga
    try {
        const res = await fetch(`${BASE_URL}/agents`);
        if (!res.ok) throw new Error('Failed to fetch agents');
        const { data } = await res.json();
        displayAgentsList(data); // Muestra la lista de agentes
    } catch (e) {
        console.error("Error fetching agents:", e);
        // Muestra un mensaje de error si la solicitud falla
        document.getElementById("agents-list").innerHTML = `
            <div class="text-red-500 dark:text-red-400 p-4 text-center">
                Failed to load agents. Please try again later.
            </div>`;
    } finally {
        setLoading(false); // Desactiva el indicador de carga
    }
};

// Llama a la función para cargar los agentes al iniciar
fetchAgents();
