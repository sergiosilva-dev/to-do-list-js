//
// Autor: Sergio Silva
// Fecha: 2025-07-07
// Descripción: Archivo JavaScript principal para la lógica del CRUD de la To-Do List sin frameworks.
//

document.addEventListener("DOMContentLoaded", () => {
  console.log("📌 To-Do List iniciada correctamente");

  // Aquí comenzará la lógica de la app
});

// Funcionalidad: Agregar tarea
document.addEventListener("DOMContentLoaded", () => {
  const formTarea = document.getElementById("form-tarea");
  const inputTarea = document.getElementById("input-tarea");
  const listaTareas = document.getElementById("lista-tareas");

  formTarea.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = inputTarea.value.trim();

    if (texto !== "") {
      const nuevaTarea = document.createElement("li");
      nuevaTarea.textContent = texto;
      nuevaTarea.classList.add("tarea");

      // Evento para marcar como completada
      nuevaTarea.addEventListener("click", () => {
        nuevaTarea.classList.toggle("completada");
      });

      listaTareas.appendChild(nuevaTarea);
      inputTarea.value = "";
    }
  });
});
