const WHATSAPP_NUMBER = "584223234253";

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const form = document.getElementById("leadForm");
const formError = document.getElementById("formError");
const minorSection = document.getElementById("minorSection");
const representanteTitle = document.getElementById("representanteTitle");
const tipoInputs = form?.querySelectorAll('input[name="tipo_inscripcion"]');

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

function showError(message) {
  formError.hidden = false;
  formError.textContent = message;
}

function clearError() {
  formError.hidden = true;
  formError.textContent = "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isMinorEnrollment() {
  const selected = form?.querySelector('input[name="tipo_inscripcion"]:checked');
  return selected?.value === "menor";
}

function updateFormMode() {
  const forMinor = isMinorEnrollment();

  minorSection.hidden = !forMinor;
  minorSection.classList.toggle("is-visible", forMinor);
  representanteTitle.textContent = forMinor ? "Datos del representante" : "Tus datos";

  minorSection.querySelectorAll("input").forEach((input) => {
    if (forMinor && input.name !== "menor_cedula") {
      input.required = true;
    } else {
      input.required = false;
      input.value = "";
    }
  });
}

tipoInputs?.forEach((input) => {
  input.addEventListener("change", updateFormMode);
});

updateFormMode();

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();

  const data = new FormData(form);
  const tipoInscripcion = String(data.get("tipo_inscripcion") || "personal");
  const forMinor = tipoInscripcion === "menor";
  const nombre = String(data.get("nombre") || "").trim();
  const apellido = String(data.get("apellido") || "").trim();
  const cedula = String(data.get("cedula") || "").trim();
  const correo = String(data.get("correo") || "").trim();
  const telefono = String(data.get("telefono") || "").trim();
  const menorNombre = String(data.get("menor_nombre") || "").trim();
  const menorApellido = String(data.get("menor_apellido") || "").trim();
  const menorEdad = String(data.get("menor_edad") || "").trim();
  const menorCedula = String(data.get("menor_cedula") || "").trim();

  if (!nombre || !apellido || !cedula || !correo || !telefono) {
    showError("Completa todos los campos para contactar al asesor.");
    return;
  }

  if (!isValidEmail(correo)) {
    showError("Ingresa un correo electrónico válido.");
    return;
  }

  if (forMinor && (!menorNombre || !menorApellido || !menorEdad)) {
    showError("Completa los datos del menor de edad.");
    return;
  }

  if (forMinor) {
    const edad = Number(menorEdad);
    if (!Number.isInteger(edad) || edad < 16) {
      showError("La edad mínima para el curso es 16 años.");
      return;
    }
  }

  const lines = [
    `Hola, soy ${nombre} ${apellido}.`,
    forMinor
      ? "Inscribo a un menor de edad como representante."
      : "Me inscribo personalmente al curso.",
    `Cédula: ${cedula}`,
    `Correo: ${correo}`,
    `Teléfono: ${telefono}`,
    "",
    "Curso de interés: Web-Developer desde Cero (HTML, CSS, JavaScript)",
  ];

  if (forMinor) {
    lines.push(
      "",
      "Datos del menor:",
      `Nombre: ${menorNombre} ${menorApellido}`,
      `Edad: ${menorEdad} años`
    );
    if (menorCedula) {
      lines.push(`Documento: ${menorCedula}`);
    }
  }

  lines.push("", "Estoy interesado en inscribirme a su curso.");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
});
