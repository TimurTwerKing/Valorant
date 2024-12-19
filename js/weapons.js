const BASE_URL = "https://valorant-api.com/v1";

// Función para crear la lista de armas
const displayWeaponsList = (weapons) => {
    const weaponsList = document.getElementById("weapons-list");
    weaponsList.innerHTML = "";
    weapons.forEach(weapon => {
        const listItem = document.createElement("li");
        listItem.classList.add("flex", "items-center", "space-x-4", "p-4", "bg-gray-800", "rounded-lg", "shadow-md", "hover:bg-gray-700", "cursor-pointer");
        listItem.innerHTML = ` 
            <img srcset="${weapon.displayIcon}?w=150 150w, ${weapon.displayIcon}?w=300 300w, ${weapon.displayIcon}?w=500 500w" 
                 sizes="(max-width: 640px) 150px, (max-width: 1024px) 300px, 500px" 
                 alt="${weapon.displayName}" class="w-1/4 object-cover rounded-lg"> 
            <div class="flex flex-col justify-center">
                <span class="text-lg font-semibold text-teal-300">${weapon.displayName}</span> 
                <p class="text-gray-400 text-sm font-medium">${weapon.shopData.categoryText.replace("EEquippableCategory::", "")}</p> 
            </div> 
        `;
        listItem.onclick = () => displayWeaponDetails(weapon);
        weaponsList.appendChild(listItem);
    });
};

// Función para mostrar los detalles de un arma seleccionada
const displayWeaponDetails = (weapon) => {
    const weaponName = document.getElementById("weapon-name");
    const defaultImage = document.getElementById("default-image");
    const weaponVideo = document.getElementById("weapon-video");
    const weaponSpecs = document.getElementById("weapon-specs");
    const skinsSection = document.getElementById("skins-section");
    const weaponSkins = document.getElementById("weapon-skins");

    // Mostrar el nombre del arma
    weaponName.textContent = weapon.displayName;

    // Desplazar la pantalla hacia el elemento con ID 'weapon-name'
    weaponName.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Cambiar a video y ocultar la imagen por defecto
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

    // Mostrar estadísticas
    weaponSpecs.innerHTML = "";
    const stats = weapon.weaponStats || {};

    // Agregar las estadísticas adicionales
    const additionalStats = {
        "Zoom Multiplier": stats.zoomMultiplier || "N/A",
        "Fire Rate": stats.fireRate || "N/A",
        "Run Speed Multiplier": stats.runSpeedMultiplier || "N/A",
        "Burst Count": stats.burstCount || "N/A",
        "First Bullet Accuracy": stats.firstBulletAccuracy || "N/A",
        "Air Burst Stats": stats.airBurstStats ? "Available" : "N/A",
        "Shotgun Stats": stats.altShotgunStats ? "Available" : "N/A"
    };

    const statsContainer = document.createElement('ul');
    statsContainer.classList.add("space-y-2", "mb-6");
    Object.entries(additionalStats).forEach(([key, value]) => {
        if (value) {
            const statItem = document.createElement('li');
            statItem.classList.add("flex", "justify-between", "text-sm", "text-gray-300");
            statItem.innerHTML = `<strong class="text-teal-300">${key}:</strong> <span>${value}</span>`;
            statsContainer.appendChild(statItem);
        }
    });

    weaponSpecs.appendChild(statsContainer);

    // Mostrar daño en diferentes rangos
    if (stats.damageRanges) {
        const damageRangesContainer = document.createElement('div');
        damageRangesContainer.classList.add("space-y-4", "mt-4");

        stats.damageRanges.forEach(range => {
            const rangeItem = document.createElement('div');
            rangeItem.classList.add("bg-gray-700", "p-4", "rounded-lg", "shadow-md");

            rangeItem.innerHTML = `
                <h3 class="text-xl font-semibold text-teal-300">Damage Range</h3>
                <ul class="list-disc pl-6 text-gray-300">
                    <li><strong>Start Range:</strong> ${range.rangeStartMeters}m</li>
                    <li><strong>End Range:</strong> ${range.rangeEndMeters}m</li>
                    <li><strong>Head Damage:</strong> ${range.headDamage}</li>
                    <li><strong>Body Damage:</strong> ${range.bodyDamage}</li>
                    <li><strong>Leg Damage:</strong> ${range.legDamage}</li>
                </ul>
            `;
            damageRangesContainer.appendChild(rangeItem);
        });

        weaponSpecs.appendChild(damageRangesContainer);
    }

    // Mostrar skins
    weaponSkins.innerHTML = "";
    weapon.skins.forEach(skin => {
        if (skin.displayIcon) {
            const skinCard = document.createElement("div");
            skinCard.classList.add("bg-gray-800", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "items-center", "hover:scale-110", "transition-transform");

            skinCard.innerHTML = `
                <img src="${skin.displayIcon}" alt="${skin.displayName}" class="w-1/2 object-cover rounded-xl">
                <p class="mt-2 text-gray-400 font-bold">${skin.displayName}</p>
            `;

            weaponSkins.appendChild(skinCard);
        }
    });

    // Mostrar la sección de Skins
    skinsSection.classList.remove("hidden");
};

// Fetch de armas
const fetchWeapons = async () => {
    try {
        const res = await fetch(`${BASE_URL}/weapons`);
        const { data } = await res.json();
        displayWeaponsList(data);
    } catch (e) {
        console.error("Error fetching weapons:", e);
    }
};

fetchWeapons();
