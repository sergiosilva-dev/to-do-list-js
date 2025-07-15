//
// Autor: Sergio Silva
// Fecha: 2025-07-09
// Descripción: Archivo JavaScript principal para la lógica del CRUD de la To-Do List sin frameworks.
//

document.addEventListener("DOMContentLoaded", () => {
  console.log("📌 To-Do List iniciada correctamente");

  // Elementos DOM
  const formTarea = document.getElementById("form-tarea");
  const inputTarea = document.getElementById("input-tarea");
  const listaTareas = document.getElementById("lista-tareas");
  const contador = document.getElementById("contador");
  const btnBorrarTodas = document.getElementById("borrar-todas");
  const botonesFiltro = document.querySelectorAll(".filtros button");
  const toggleTema = document.getElementById("toggle-tema");
  const iconoTema = document.getElementById("icono-tema");

  // Inicializar tema desde localStorage
  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado === "oscuro") {
    document.body.classList.add("tema-oscuro");
    iconoTema.className = "fas fa-sun";
  } else {
    iconoTema.className = "fas fa-moon";
  }

  // Toggle de tema claro / oscuro
  toggleTema.addEventListener("click", () => {
    const esOscuro = document.body.classList.toggle("tema-oscuro");
    iconoTema.className = esOscuro ? "fas fa-sun" : "fas fa-moon";
    localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
  });

  // Enviar formulario (Agregar tarea)
  formTarea.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = inputTarea.value.trim();

    if (texto === "") {
      inputTarea.classList.add("input-error");
      inputTarea.focus();
      return;
    }

    if (texto.length < 3 || texto.length > 100) {
      mostrarToast("❌ La tarea debe tener entre 3 y 100 caracteres.");
      inputTarea.classList.add("input-error");
      return;
    }

    const tareasActuales = Array.from(
      document.querySelectorAll(".texto-tarea")
    ).map((el) => el.textContent.trim().toLowerCase());

    if (tareasActuales.includes(texto.toLowerCase())) {
      mostrarToast("⚠️ Ya existe una tarea con ese texto.");
      inputTarea.classList.add("input-error");
      return;
    }

    inputTarea.classList.remove("input-error");
    agregarTarea(texto);
    inputTarea.value = "";
    guardarTareas();
  });

  // Quitar error al escribir
  inputTarea.addEventListener("input", () => {
    inputTarea.classList.remove("input-error");
  });

  function agregarTarea(texto, completada = false, fecha = null) {
    const nuevaTarea = document.createElement("li");
    const fechaCreacion =
      fecha ||
      new Date().toLocaleString("es-CO", {
        dateStyle: "short",
        timeStyle: "short",
      });

    nuevaTarea.setAttribute("data-fecha", fechaCreacion);
    nuevaTarea.classList.add("tarea");
    if (completada) nuevaTarea.classList.add("completada");

    const spanTexto = document.createElement("span");
    spanTexto.textContent = texto;
    spanTexto.classList.add("texto-tarea");

    const spanFecha = document.createElement("span");
    spanFecha.textContent = fechaCreacion;
    spanFecha.classList.add("fecha-tarea");

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
      }, 300);
    });

    spanTexto.addEventListener("click", () => {
      nuevaTarea.classList.toggle("completada");
      guardarTareas();
      actualizarContador();
    });

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
    nuevaTarea.appendChild(spanFecha);
    nuevaTarea.appendChild(btnEliminar);
    listaTareas.appendChild(nuevaTarea);

    setTimeout(() => nuevaTarea.classList.add("animada"), 10);
  }

  function guardarTareas() {
    const tareas = [];
    document.querySelectorAll(".tarea").forEach((tarea) => {
      const texto = tarea.querySelector(".texto-tarea").textContent;
      const completada = tarea.classList.contains("completada");
      const fecha = tarea.getAttribute("data-fecha");
      tareas.push({ texto, completada, fecha });
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }

  function cargarTareas() {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(({ texto, completada, fecha }) => {
      agregarTarea(texto, completada, fecha);
    });
    actualizarContador();
  }

  function actualizarContador() {
    const pendientes = Array.from(document.querySelectorAll(".tarea")).filter(
      (t) => !t.classList.contains("completada")
    );
    contador.textContent = `${pendientes.length} tareas pendientes`;
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

  botonesFiltro.forEach((btn) => {
    btn.addEventListener("click", () => {
      botonesFiltro.forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      aplicarFiltro(btn.dataset.filtro);
    });
  });

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

  document.getElementById("exportar-json").addEventListener("click", () => {
    const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    const blob = new Blob([JSON.stringify(tareas, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tareas.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("exportar-csv").addEventListener("click", () => {
    const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    let csv = "Tarea,Completada,Fecha\n";

    tareas.forEach(({ texto, completada, fecha }) => {
      const fila = `"${texto.replace(/"/g, '""')}",${completada},"${fecha}"`;
      csv += fila + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tareas.csv";
    a.click();
    URL.revokeObjectURL(url);
  });

  const inputArchivo = document.getElementById("archivo-importar");
  const btnImportar = document.getElementById("btn-importar");

  btnImportar.addEventListener("click", () => {
    inputArchivo.click();
  });

  inputArchivo.addEventListener("change", (event) => {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const contenido = e.target.result;

      if (archivo.name.endsWith(".json")) {
        try {
          const tareasImportadas = JSON.parse(contenido);
          tareasImportadas.forEach(({ texto, completada, fecha }) => {
            agregarTarea(texto, completada, fecha);
          });
          guardarTareas();
          actualizarContador();
          mostrarToast("✅ Tareas importadas correctamente (JSON)");
        } catch (err) {
          mostrarToast("❌ Error al importar el archivo JSON.");
        }
      } else if (archivo.name.endsWith(".csv")) {
        const lineas = contenido.trim().split("\n").slice(1);
        lineas.forEach((linea) => {
          const [texto, completada, fecha] = linea.split(",");
          agregarTarea(
            texto.replace(/^"|"$/g, "").replace(/""/g, '"'),
            completada === "true",
            fecha.replace(/^"|"$/g, "")
          );
        });
        guardarTareas();
        actualizarContador();
        mostrarToast("✅ Tareas importadas correctamente (CSV)");
      } else {
        mostrarToast("❌ Formato no compatible. Usa .json o .csv");
      }

      inputArchivo.value = "";
    };

    reader.readAsText(archivo);
  });

  function mostrarToast(mensaje) {
    const contenedor = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = mensaje;
    contenedor.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Inicializar app
  cargarTareas();
});
