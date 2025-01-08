document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("nav.html");
    const html = await response.text();

    const elementToInsert = document.getElementById('nav-snippet')
    elementToInsert.insertAdjacentHTML("afterend", html);

    elementToInsert.remove();

    // Obtiene la ruta actual de la página
    const currentPath = window.location.pathname.split("/").pop();

    // Resalta el enlace activo
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add(
          "text-indigo-600",
          "dark:text-pink-400",
          "font-bold",
          "underline"
        );
      } else {
        link.classList.remove(
          "text-indigo-600",
          "dark:text-pink-400",
          "font-bold",
          "underline"
        );
      }
    });
  } catch (error) {
    console.error("Error cargando el navbar:", error);
  }

  // Verifica si hay un tema guardado en localStorage
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    // Si hay un tema guardado, aplícalo
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  } else {
    // Si no hay tema guardado, determina el tema inicial según la preferencia del sistema
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
    localStorage.setItem("theme", prefersDark ? "dark" : "light");
  }

  // Agrega un evento de clic al botón para alternar el tema
  const themeToggleButton = document.getElementById("theme-toggle");
  console.log(themeToggleButton);
  themeToggleButton.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    // Guarda la preferencia del usuario
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});
