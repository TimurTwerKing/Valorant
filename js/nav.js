document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("nav.html");
      const html = await response.text();
      
      // Insertar el contenido del navbar en el DOM
      document.body.insertAdjacentHTML("afterbegin", html);
  
      // Obtener la ruta actual
      const currentPath = window.location.pathname.split("/").pop();
  
      // Resaltar el enlace activo
      const navLinks = document.querySelectorAll("nav ul li a");
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === currentPath) {
          link.style.color = "red";
        }
      });
    } catch (error) {
      console.error("Error cargando el navbar:", error);
    }
  });
  
 
  
