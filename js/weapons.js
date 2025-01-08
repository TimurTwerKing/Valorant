// URL base para realizar solicitudes a la API de Valorant
const BASE_URL = "https://valorant-api.com/v1";

// Renderiza la lista de armas en la página
const displayWeaponsList = (weapons) => {
    const weaponsList = document.getElementById("weapons-list");
    weaponsList.innerHTML = ""; // Limpia la lista existente

    // Itera sobre las armas y crea elementos de lista para cada una
    weapons.forEach(weapon => {
        const listItem = document.createElement("li");
        listItem.classList.add(
            "flex", "items-center", "space-x-4", "p-4",
            "bg-white", "hover:bg-gray-100", "dark:bg-gray-800",
            "rounded-lg", "shadow-md", "dark:hover:bg-gray-700",
            "cursor-pointer", "transition-all", "duration-200"
        );

        // Contenido HTML del elemento de lista
        listItem.innerHTML = `
        <img src="${weapon.displayIcon}" 
             alt="${weapon.displayName}" 
             class="w-40 h-12 md:w-16 lg:w-48 object-contain rounded-lg">
        <div class="flex flex-col justify-center">
            <span class="text-lg font-semibold text-teal-300">${weapon.displayName}</span>
            <p class="text-gray-400 text-sm font-medium">
                ${weapon.shopData.categoryText?.replace("EEquippableCategory::", "") || "Unknown"}
            </p>
        </div>
    `;

        // Evento al hacer clic en un arma
        listItem.onclick = () => displayWeaponDetails(weapon);
        weaponsList.appendChild(listItem); // Añade el arma a la lista
    });
};

// Muestra los detalles de un arma seleccionada
const displayWeaponDetails = (weapon) => {
    const weaponName = document.getElementById("weapon-name");
    const defaultImage = document.getElementById("default-image");
    const weaponVideo = document.getElementById("weapon-video");
    const weaponSpecs = document.getElementById("weapon-specs");
    const skinsSection = document.getElementById("skins-section");
    const weaponSkins = document.getElementById("weapon-skins");

    // Actualiza el nombre del arma
    weaponName.textContent = weapon.displayName;
    weaponName.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Intenta mostrar un video de skin si está disponible
    const videoUrl = weapon.skins.flatMap(skin => skin.levels.concat(skin.chromas))
        .find(level => level.streamedVideo)?.streamedVideo;

    if (videoUrl) {
        weaponVideo.src = `${videoUrl}?autoplay=1&mute=1`;
        weaponVideo.classList.remove("hidden");
        defaultImage.classList.add("hidden");
    } else {
        weaponVideo.src = "";
        weaponVideo.classList.add("hidden");
        defaultImage.classList.remove("hidden");
    }

    // Muestra estadísticas del arma
    weaponSpecs.innerHTML = "";
    const stats = weapon.weaponStats || {};
    const additionalStats = {
        "Zoom Multiplier": stats.zoomMultiplier || "N/A",
        "Fire Rate": stats.fireRate || "N/A",
        "Run Speed Multiplier": stats.runSpeedMultiplier || "N/A",
        "Burst Count": stats.burstCount || "N/A",
        "First Bullet Accuracy": stats.firstBulletAccuracy || "N/A",
        "Air Burst Stats": stats.airBurstStats ? "Available" : "N/A",
        "Shotgun Stats": stats.altShotgunStats ? "Available" : "N/A"
    };

    // Renderiza estadísticas adicionales como tarjetas
    const statsContainer = document.createElement('div');
    statsContainer.classList.add("grid", "grid-cols-2", "gap-4", "mb-6");
    Object.entries(additionalStats).forEach(([key, value]) => {
        const statCard = document.createElement('div');
        statCard.classList.add(
            "bg-white", "hover:bg-gray-100", "dark:bg-gray-800", "dark:hover:bg-gray-700",
            "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "justify-center",
            "transition-all", "duration-200"
        );
        statCard.innerHTML = `
            <strong class="text-teal-300 text-lg">${key}</strong>
            <span class="text-gray-400 text-sm">${value}</span>
        `;
        statsContainer.appendChild(statCard);
    });

    weaponSpecs.appendChild(statsContainer);

    // Muestra rangos de daño si están disponibles
    if (stats.damageRanges) {
        const damageRangesContainer = document.createElement('div');
        damageRangesContainer.classList.add("grid", "grid-cols-1", "gap-4", "mt-4");

        stats.damageRanges.forEach(range => {
            const rangeCard = document.createElement('div');
            rangeCard.classList.add(
                "bg-white", "hover:bg-gray-100", "dark:bg-gray-800", "dark:hover:bg-gray-700",
                "p-4", "rounded-lg", "shadow-md", "transition-all", "duration-200"
            );

            rangeCard.innerHTML = `
                <h3 class="text-xl font-semibold text-teal-300">Damage Range</h3>
                <ul class="space-y-2 text-gray-400 text-sm">
                    <li><strong>Start Range:</strong> ${range.rangeStartMeters}m</li>
                    <li><strong>End Range:</strong> ${range.rangeEndMeters}m</li>
                    <li><strong>Head Damage:</strong> ${range.headDamage}</li>
                    <li><strong>Body Damage:</strong> ${range.bodyDamage}</li>
                    <li><strong>Leg Damage:</strong> ${range.legDamage}</li>
                </ul>
            `;
            damageRangesContainer.appendChild(rangeCard);
        });

        weaponSpecs.appendChild(damageRangesContainer);
    }

    // Renderiza skins del arma
    weaponSkins.innerHTML = "";
    weapon.skins.forEach(skin => {
        if (skin.displayIcon) {
            const skinCard = document.createElement("div");
            skinCard.classList.add(
                "bg-white", "hover:bg-gray-100", "dark:bg-gray-800", "dark:hover:bg-gray-700",
                "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "items-center",
                "hover:scale-110", "transition-transform", "cursor-pointer", "transition-all", "duration-200"
            );
            skinCard.innerHTML = `
                <img src="${skin.displayIcon}" alt="${skin.displayName}" class="w-1/2 object-cover rounded-xl">
                <p class="mt-2 text-gray-400 font-bold">${skin.displayName}</p>
            `;
            weaponSkins.appendChild(skinCard);
        }
    });

    // Muestra la sección de skins
    skinsSection.classList.remove("hidden");
};

// Obtiene las armas desde la API
const fetchWeapons = async () => {
    try {
        const res = await fetch(`${BASE_URL}/weapons`);
        const { data } = await res.json();
        displayWeaponsList(data); // Renderiza la lista de armas
    } catch (e) {
        console.error("Error fetching weapons:", e); // Maneja errores
    }
};

// Llama a la función para cargar las armas al iniciar
fetchWeapons();
