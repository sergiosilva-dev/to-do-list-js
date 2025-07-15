/* 
Autor: Sergio Silva
Fecha: 2025-07-15
Descripción: Funcionalidad de To-Do List sin frameworks. 
*/

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggleTemaBtn = document.getElementById("toggle-tema");
  const iconoTema = document.getElementById("icono-tema");
  const formTarea = document.getElementById("form-tarea");
  const inputTarea = document.getElementById("input-tarea");
  const selectPrioridad = document.getElementById("select-prioridad");
  const listaTareas = document.getElementById("lista-tareas");
  const contador = document.getElementById("contador");
  const filtros = document.querySelectorAll(".filtros button");
  const btnBorrarTodas = document.getElementById("borrar-todas");
  const btnExportarJSON = document.getElementById("exportar-json");
  const btnExportarCSV = document.getElementById("exportar-csv");
  const btnImportar = document.getElementById("btn-importar");
  const archivoImportar = document.getElementById("archivo-importar");
  const inputBusqueda = document.getElementById("input-busqueda");
  const toastContainer = document.getElementById("toast-container");

  let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  let filtroActivo = "todas";

  const guardarTareas = () => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
    renderizarTareas();
  };

  const renderizarTareas = () => {
    listaTareas.innerHTML = "";

    let tareasFiltradas = tareas.filter((tarea) => {
      if (filtroActivo === "todas") return true;
      if (filtroActivo === "pendientes") return !tarea.completada;
      if (filtroActivo === "completadas") return tarea.completada;
    });

    const termino = inputBusqueda.value.toLowerCase();
    if (termino) {
      tareasFiltradas = tareasFiltradas.filter((t) =>
        t.texto.toLowerCase().includes(termino)
      );
    }

    tareasFiltradas.forEach((tarea, index) => {
      const li = document.createElement("li");
      li.classList.add("tarea-item", `prioridad-${tarea.prioridad}`);

      if (tarea.completada) {
        li.style.textDecoration = "line-through";
        li.style.opacity = "0.6";
      }

      li.innerHTML = `
                <span>${tarea.texto}</span>
                <small>${tarea.fecha}</small>
                <button class="eliminar" data-index="${index}" aria-label="Eliminar tarea">
                    <i class="fas fa-trash"></i>
                </button>
            `;

      li.addEventListener("click", (e) => {
        if (!e.target.closest(".eliminar")) {
          tareas[index].completada = !tareas[index].completada;
          guardarTareas();
        }
      });

      listaTareas.appendChild(li);
    });

    actualizarContador();
  };

  const actualizarContador = () => {
    const pendientes = tareas.filter((t) => !t.completada).length;
    contador.textContent = `${pendientes} tareas pendientes`;
  };

  formTarea.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = inputTarea.value.trim();
    if (!texto) return;

    const nuevaTarea = {
      texto,
      prioridad: selectPrioridad.value,
      completada: false,
      fecha: new Date().toLocaleString(),
    };

    tareas.push(nuevaTarea);
    inputTarea.value = "";
    guardarTareas();
    mostrarToast("Tarea agregada correctamente");
  });

  listaTareas.addEventListener("click", (e) => {
    if (e.target.closest(".eliminar")) {
      const index = e.target.closest(".eliminar").dataset.index;
      tareas.splice(index, 1);
      guardarTareas();
      mostrarToast("Tarea eliminada");
    }
  });

  toggleTemaBtn.addEventListener("click", () => {
    const temaOscuro = body.getAttribute("data-tema") === "oscuro";
    body.setAttribute("data-tema", temaOscuro ? "claro" : "oscuro");
    iconoTema.className = temaOscuro ? "fas fa-moon" : "fas fa-gear";
    localStorage.setItem("tema", temaOscuro ? "claro" : "oscuro");
  });

  filtros.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtros.forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      filtroActivo = btn.dataset.filtro;
      renderizarTareas();
    });
  });

  btnBorrarTodas.addEventListener("click", () => {
    if (confirm("¿Seguro que deseas eliminar todas las tareas?")) {
      tareas = [];
      guardarTareas();
      mostrarToast("Todas las tareas fueron eliminadas");
    }
  });

  btnExportarJSON.addEventListener("click", () => {
    const dataStr = JSON.stringify(tareas, null, 2);
    descargarArchivo("tareas.json", dataStr);
  });

  btnExportarCSV.addEventListener("click", () => {
    const encabezados = "Texto,Prioridad,Fecha,Completada\n";
    const filas = tareas
      .map((t) => `"${t.texto}","${t.prioridad}","${t.fecha}",${t.completada}`)
      .join("\n");
    descargarArchivo("tareas.csv", encabezados + filas);
  });

  const descargarArchivo = (nombre, contenido) => {
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  btnImportar.addEventListener("click", () => archivoImportar.click());

  archivoImportar.addEventListener("change", (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (e) => {
      try {
        const importadas = JSON.parse(e.target.result);
        tareas = tareas.concat(importadas);
        guardarTareas();
        mostrarToast("Tareas importadas correctamente");
      } catch {
        mostrarToast("Error al importar el archivo");
      }
    };
    lector.readAsText(archivo);
  });

  inputBusqueda.addEventListener("input", renderizarTareas);

  const mostrarToast = (mensaje) => {
    const toast = document.createElement("div");
    toast.textContent = mensaje;
    toast.style.background = "var(--primario)";
    toast.style.color = "white";
    toast.style.padding = "0.5rem 1rem";
    toast.style.marginTop = "0.5rem";
    toast.style.borderRadius = "5px";
    toast.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    toast.style.opacity = "0.9";

    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Tema guardado
  const temaGuardado = localStorage.getItem("tema") || "claro";
  body.setAttribute("data-tema", temaGuardado);
  iconoTema.className =
    temaGuardado === "oscuro" ? "fas fa-gear" : "fas fa-moon";

  renderizarTareas();
});
