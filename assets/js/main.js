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
      nuevaTarea.classList.add("tarea");

      const spanTexto = document.createElement("span");
      spanTexto.textContent = texto;
      spanTexto.classList.add("texto-tarea");

      // Botón eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "🗑️";
      btnEliminar.classList.add("btn-eliminar");
      btnEliminar.setAttribute("aria-label", "Eliminar tarea");

      btnEliminar.addEventListener("click", () => {
        listaTareas.removeChild(nuevaTarea);
      });

      // Marcar como completada al hacer click en el texto
      spanTexto.addEventListener("click", () => {
        nuevaTarea.classList.toggle("completada");
      });

      nuevaTarea.appendChild(spanTexto);
      nuevaTarea.appendChild(btnEliminar);

      listaTareas.appendChild(nuevaTarea);
      inputTarea.value = "";
    }
  });
});
