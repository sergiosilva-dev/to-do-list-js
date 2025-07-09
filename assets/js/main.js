//
// Autor: Sergio Silva
// Fecha: 2025-07-07
// Descripción: Archivo JavaScript principal para la lógica del CRUD de la To-Do List sin frameworks.
//

// Este archivo maneja la creación, eliminación y almacenamiento de tareas en una lista de pendientes.
// Utiliza Local Storage para persistir las tareas entre recargas de página.
document.addEventListener("DOMContentLoaded", () => {
  console.log("📌 To-Do List iniciada correctamente");

  // Selección de elementos del DOM
  const formTarea = document.getElementById("form-tarea");
  const inputTarea = document.getElementById("input-tarea");
  const listaTareas = document.getElementById("lista-tareas");

  // Manejo del evento de envío del formulario
  formTarea.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = inputTarea.value.trim();

    if (texto !== "") {
      agregarTarea(texto);
      inputTarea.value = "";
      guardarTareas();
    }
  });

  // Función para agregar una nueva tarea a la lista
  function agregarTarea(texto, completada = false) {
    const nuevaTarea = document.createElement("li");
    nuevaTarea.classList.add("tarea");
    if (completada) nuevaTarea.classList.add("completada");

    const spanTexto = document.createElement("span");
    spanTexto.textContent = texto;
    spanTexto.classList.add("texto-tarea");

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑️";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.setAttribute("aria-label", "Eliminar tarea");

    btnEliminar.addEventListener("click", () => {
      nuevaTarea.remove();
      guardarTareas();
    });

    spanTexto.addEventListener("click", () => {
      nuevaTarea.classList.toggle("completada");
      guardarTareas();
    });

    // Editar tarea al hacer doble clic
    spanTexto.addEventListener("dblclick", () => {
      const textoActual = spanTexto.textContent;
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = textoActual;
      inputEdit.classList.add("input-edicion");

      nuevaTarea.replaceChild(inputEdit, spanTexto);
      inputEdit.focus();

      // Guardar nuevo texto al perder foco o presionar Enter
      const guardarEdicion = () => {
        const nuevoTexto = inputEdit.value.trim();
        if (nuevoTexto !== "") {
          spanTexto.textContent = nuevoTexto;
          nuevaTarea.replaceChild(spanTexto, inputEdit);
          actualizarLocalStorage(); // si tienes localStorage
        } else {
          // Si el campo queda vacío, se elimina la tarea
          nuevaTarea.remove();
          actualizarLocalStorage();
        }
      };

      inputEdit.addEventListener("blur", guardarEdicion);
      inputEdit.addEventListener("keydown", (e) => {
        if (e.key === "Enter") guardarEdicion();
      });
    });

    nuevaTarea.appendChild(spanTexto);
    nuevaTarea.appendChild(btnEliminar);
    listaTareas.appendChild(nuevaTarea);
  }

  // Funciones para guardar y cargar tareas desde Local Storage
  function guardarTareas() {
    const tareas = [];
    document.querySelectorAll(".tarea").forEach((tarea) => {
      const texto = tarea.querySelector(".texto-tarea").textContent;
      const completada = tarea.classList.contains("completada");
      tareas.push({ texto, completada });
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }

  // Cargar tareas desde Local Storage al iniciar la aplicación
  function cargarTareas() {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(({ texto, completada }) => {
      agregarTarea(texto, completada);
    });
  }

  // Cargar tareas al iniciar la aplicación
  cargarTareas();

  function actualizarContador() {
    const tareas = document.querySelectorAll(".tarea");
    const pendientes = Array.from(tareas).filter(
      (t) => !t.classList.contains("completada")
    );
    document.getElementById(
      "contador"
    ).textContent = `${pendientes.length} tareas pendientes`;
  }

  function aplicarFiltro(tipo) {
    const tareas = document.querySelectorAll(".tarea");
    tareas.forEach((t) => {
      switch (tipo) {
        case "pendientes":
          t.style.display = t.classList.contains("completada")
            ? "none"
            : "flex";
          break;
        case "completadas":
          t.style.display = t.classList.contains("completada")
            ? "flex"
            : "none";
          break;
        default:
          t.style.display = "flex";
      }
    });
  }

  document.getElementById("lista-tareas").addEventListener("click", () => {
    actualizarContador();
  });

  document.querySelectorAll(".filtros button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filtros button")
        .forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      aplicarFiltro(btn.dataset.filtro);
    });
  });

  document.getElementById("borrar-todas").addEventListener("click", () => {
    document.getElementById("lista-tareas").innerHTML = "";
    actualizarContador();
  });

  document.addEventListener("DOMContentLoaded", actualizarContador);
});

// Función para actualizar el Local Storage con las tareas actuales
function actualizarLocalStorage() {
  const tareas = [];
  document.querySelectorAll(".tarea").forEach((tarea) => {
    const texto = tarea.querySelector(".texto-tarea").textContent;
    const completada = tarea.classList.contains("completada");
    tareas.push({ texto, completada });
  });
  localStorage.setItem("tareas", JSON.stringify(tareas));
}
