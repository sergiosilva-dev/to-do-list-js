//
// Autor: Sergio Silva
// Fecha: 2025-07-09
// Descripción: Archivo JavaScript principal para la lógica del CRUD de la To-Do List sin frameworks.
//

document.addEventListener("DOMContentLoaded", () => {
  console.log("📌 To-Do List iniciada correctamente");

  // Selección de elementos del DOM
  const formTarea = document.getElementById("form-tarea");
  const inputTarea = document.getElementById("input-tarea");
  const listaTareas = document.getElementById("lista-tareas");
  const contador = document.getElementById("contador");
  const btnBorrarTodas = document.getElementById("borrar-todas");
  const botonesFiltro = document.querySelectorAll(".filtros button");

  // Evento: Envío del formulario para agregar tarea
  formTarea.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = inputTarea.value.trim();

    if (texto === "") {
      inputTarea.classList.add("input-error");
      inputTarea.focus();
      return;
    }

    inputTarea.classList.remove("input-error");
    agregarTarea(texto);
    inputTarea.value = "";
    guardarTareas();
  });

  // Evento: Limpiar el campo de entrada al hacer clic
  inputTarea.addEventListener("input", () => {
    if (inputTarea.classList.contains("input-error")) {
      inputTarea.classList.remove("input-error");
    }
  });

  // Función: Agrega una tarea al DOM
  function agregarTarea(texto, completada = false) {
    const nuevaTarea = document.createElement("li");
    nuevaTarea.classList.add("tarea");
    nuevaTarea.setAttribute("role", "listitem");
    nuevaTarea.setAttribute("tabindex", "0");
    nuevaTarea.setAttribute(
      "aria-label",
      completada ? `Tarea completada: ${texto}` : `Tarea pendiente: ${texto}`
    );
    if (completada) nuevaTarea.classList.add("completada");

    const spanTexto = document.createElement("span");
    spanTexto.textContent = texto;
    spanTexto.classList.add("texto-tarea");
    spanTexto.setAttribute("role", "button");
    spanTexto.setAttribute("tabindex", "0");
    spanTexto.setAttribute("aria-pressed", completada ? "true" : "false");
    spanTexto.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        nuevaTarea.classList.toggle("completada");
        guardarTareas();
      }
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑️";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.setAttribute("aria-label", "Eliminar tarea");

    btnEliminar.addEventListener("click", () => {
      nuevaTarea.classList.add("eliminando");
      setTimeout(() => {
        nuevaTarea.remove();
        guardarTareas();
        actualizarContador();
      }, 300); // tiempo debe coincidir con la duración de la transición
    });

    // Evento: Marcar como completada al hacer clic
    spanTexto.addEventListener("click", () => {
      nuevaTarea.classList.toggle("completada");
      guardarTareas();
      actualizarContador();
    });

    // Evento: Editar tarea al hacer doble clic
    spanTexto.addEventListener("dblclick", () => {
      const textoActual = spanTexto.textContent;
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = textoActual;
      inputEdit.classList.add("input-edicion");

      nuevaTarea.replaceChild(inputEdit, spanTexto);
      inputEdit.focus();

      const guardarEdicion = () => {
        const nuevoTexto = inputEdit.value.trim();
        if (nuevoTexto !== "") {
          spanTexto.textContent = nuevoTexto;
          nuevaTarea.replaceChild(spanTexto, inputEdit);
          guardarTareas();
        } else {
          nuevaTarea.remove();
          guardarTareas();
        }
        actualizarContador();
      };

      inputEdit.addEventListener("blur", guardarEdicion);
      inputEdit.addEventListener("keydown", (e) => {
        if (e.key === "Enter") guardarEdicion();
      });
    });

    nuevaTarea.appendChild(spanTexto);
    nuevaTarea.appendChild(btnEliminar);
    listaTareas.appendChild(nuevaTarea);
    // Animación de entrada con retraso mínimo para permitir transición
    setTimeout(() => {
      nuevaTarea.classList.add("animada");
    }, 10);
  }

  // Función: Guardar tareas en Local Storage
  function guardarTareas() {
    const tareas = [];
    document.querySelectorAll(".tarea").forEach((tarea) => {
      const texto = tarea.querySelector(".texto-tarea").textContent;
      const completada = tarea.classList.contains("completada");
      tareas.push({ texto, completada });
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }

  // Función: Cargar tareas desde Local Storage
  function cargarTareas() {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(({ texto, completada }) => {
      agregarTarea(texto, completada);
    });
    actualizarContador();
  }

  // Función: Actualizar contador de tareas pendientes
  function actualizarContador() {
    const tareas = document.querySelectorAll(".tarea");
    const pendientes = Array.from(tareas).filter(
      (t) => !t.classList.contains("completada")
    );
    contador.textContent = `${pendientes.length} tareas pendientes`;
  }

  // Función: Aplicar filtros (Todas, Pendientes, Completadas)
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

  // Evento: Filtros
  botonesFiltro.forEach((btn) => {
    btn.addEventListener("click", () => {
      botonesFiltro.forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      aplicarFiltro(btn.dataset.filtro);
    });
  });

  // Evento: Borrar todas las tareas con confirmación
  btnBorrarTodas.addEventListener("click", () => {
    const confirmacion = confirm(
      "¿Estás seguro de que deseas borrar todas las tareas?"
    );
    if (confirmacion) {
      listaTareas.innerHTML = "";
      guardarTareas();
      actualizarContador();
    }
  });

  // Inicialización al cargar la página
  cargarTareas();
});
