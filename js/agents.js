const BASE_URL = "https://valorant-api.com/v1";

const displayAgentsList = (agents) => {
    const agentsList = document.getElementById("agents-list");
    agentsList.innerHTML = "";

    agents.forEach(agent => {
        const listItem = document.createElement("li");
        listItem.classList.add("flex", "items-center", "space-x-4", "p-4", "bg-gray-800", "rounded-lg", "shadow-md", "hover:bg-gray-700", "cursor-pointer");

        listItem.innerHTML = `
        <img src="${agent.displayIconSmall}" alt="${agent.displayName}" class="w-16 h-16 object-cover rounded-lg">
        <div>
            <span class="text-lg font-semibold text-red-500">${agent.displayName}</span>
            <p class="text-gray-400 text-sm font-medium"> ${agent.developerName}</p>
        </div>
    `;

        listItem.onclick = () => displayAgentDetails(agent);
        agentsList.appendChild(listItem);
    });
};

const displayAgentDetails = (agent) => {
    document.getElementById("default-image").classList.add("hidden");
    document.getElementById("agent-image").classList.remove("hidden");
    document.getElementById("default-description").classList.add("hidden");
    document.getElementById("agent-description").classList.remove("hidden");

    document.getElementById("agent-name").textContent = agent.displayName;
    document.getElementById("agent-image").src = agent.fullPortrait || '../img/allAgents.jpg';
    document.getElementById("agent-description").textContent = agent.description || 'No description available for this agent.';

    const abilitiesList = document.getElementById("abilities-list");
    abilitiesList.innerHTML = "";
    agent.abilities.forEach(ability => {
        const abilityCard = document.createElement("div");
        abilityCard.classList.add("bg-gray-800", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "items-center", "hover:scale-105", "transition-transform");

        abilityCard.innerHTML = `
            <img src="${ability.displayIcon}" alt="${ability.displayName}" class="w-12 h-12 object-cover rounded-full mb-2">
            <h4 class="text-red-500 font-bold text-lg mb-2">${ability.displayName}</h4>
            <p class="text-gray-400 text-sm mb-2"><strong>Slot:</strong> ${ability.slot}</p>
            <p class="text-gray-400 text-sm">${ability.description}</p>
        `;
        abilitiesList.appendChild(abilityCard);
    });

    // Desplazar la pantalla hacia el elemento con ID 'agent-name'
    document.getElementById("agent-name").scrollIntoView({ behavior: "smooth", block: "center" });
};

fetchAgents = async () => {
    const res = await fetch(`${BASE_URL}/agents`);
    const { data } = await res.json();
    displayAgentsList(data);
};

fetchAgents();
