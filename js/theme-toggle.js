document.addEventListener("DOMContentLoaded", () => {
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
      alert('a');
      const isDark = document.documentElement.classList.toggle("dark");
      // Guarda la preferencia del usuario
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  });
  