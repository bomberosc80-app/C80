// Usuarios embebidos
const usuarios = {
  "admin": { password: "1234", role: "admin" },
  "brigadista1": { password: "1111", role: "user" },
  "brigadista2": { password: "2222", role: "user" }
};

// Elementos del DOM
const loginContainer = document.getElementById("loginContainer");
const appContainer = document.getElementById("appContainer");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginError = document.getElementById("loginError");
const adminPanel = document.getElementById("adminPanel");
const inventarioBody = document.getElementById("inventarioBody");
const csvFileInput = document.getElementById("csvFileInput");
const uploadBtn = document.getElementById("uploadBtn");
const previewContainer = document.getElementById("previewContainer");

// --- LOGIN ---
loginBtn.addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (usuarios[user] && usuarios[user].password === pass) {
    loginContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");

    if (usuarios[user].role === "admin") {
      adminPanel.classList.remove("hidden");
    }
    cargarInventario();
  } else {
    loginError.textContent = "Usuario o contraseña incorrectos";
  }
});

logoutBtn.addEventListener("click", () => {
  appContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
});

// --- CARGAR INVENTARIO DESDE CSV ---
async function cargarInventario() {
  try {
    const response = await fetch("inventario.csv");
    const data = await response.text();
    mostrarInventario(data);
  } catch (error) {
    console.error("Error al cargar CSV:", error);
  }
}

function mostrarInventario(csvData) {
  const filas = csvData.trim().split("\n").slice(1);
  inventarioBody.innerHTML = "";

  filas.forEach(fila => {
    const cols = fila.split(",");
    const tr = document.createElement("tr");
    cols.forEach(col => {
      const td = document.createElement("td");
      td.textContent = col.trim();
      tr.appendChild(td);
    });
    inventarioBody.appendChild(tr);
  });
}

// --- SUBIR NUEVO CSV (solo admin) ---
uploadBtn.addEventListener("click", () => {
  const file = csvFileInput.files[0];
  if (!file) return alert("Selecciona un archivo CSV");

  const reader = new FileReader();
  reader.onload = e => {
    const contenido = e.target.result;
    previewContainer.innerHTML = `
      <h3>Previsualización del archivo</h3>
      <pre>${contenido}</pre>
    `;
  };
  reader.readAsText(file);
});
