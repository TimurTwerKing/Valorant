document.addEventListener("DOMContentLoaded", () => {
  // Verifica el tema guardado
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
      document.body.classList.add("dark");
  } else {
      document.body.classList.remove("dark");
  }

  // Obtener el botón y agregar el evento para cambiar el tema
  const themeToggleButton = document.getElementById('theme-toggle');
  themeToggleButton.addEventListener('click', () => {
      // Cambiar el tema
      document.body.classList.toggle('dark');
      
      // Guardar la preferencia en localStorage
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});
