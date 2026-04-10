const startBtn = document.getElementById("startBtn");
const container = document.getElementById("mainContainer");

let respuestaUsuario = "";

// imágenes
const imagenes = [
  { src: "assets/images/img1.jpg", blasto: "Mieloblasto", tipo: "LAM" },
  { src: "assets/images/img2.jpg", blasto: "Mieloblasto", tipo: "LAM" },
  { src: "assets/images/img3.jpg", blasto: "Mieloblasto con bastones de Auer", tipo: "LAM" },
  { src: "assets/images/img4.jpg", blasto: "Monoblasto", tipo: "LAM" },
  { src: "assets/images/img5.jpg", blasto: "Promonocito", tipo: "LAM" },
  { src: "assets/images/img6.jpg", blasto: "Linfoblasto L1", tipo: "LAL" },
  { src: "assets/images/img7.jpg", blasto: "Linfoblasto", tipo: "LAL" },
  { src: "assets/images/img8.jpg", blasto: "Linfoblasto L3", tipo: "LAL" },
  { src: "assets/images/img9.jpg", blasto: "Linfoblasto L3", tipo: "LAL" },
  { src: "assets/images/img10.jpg", blasto: "Neutrófilo en banda", tipo: "No leucemia aguda" }
];

const frases = [
  "Analizando morfología celular...",
  "Evaluando núcleo/citoplasma...",
  "Detectando estructuras...",
  "Comparando con base de datos..."
];

// inicio
startBtn.addEventListener("click", () => {
  const seleccion = [...imagenes].sort(() => 0.5 - Math.random()).slice(0, 8);

  container.innerHTML = `
    <h2>Seleccione una muestra</h2>
    <div class="grid">
      ${seleccion.map(img => `<img src="${img.src}" onclick="preguntarUsuario('${img.src}')">`).join("")}
    </div>
  `;
});

// pregunta
function preguntarUsuario(src) {
  container.innerHTML = `
    <h2>¿Qué tipo es?</h2>
    <img src="${src}" style="width:250px; border-radius:10px;">
    <br><br>
    <button onclick="guardarRespuesta('${src}','LAM')">Mieloide</button>
    <button onclick="guardarRespuesta('${src}','LAL')">Linfoide</button>
  `;
}

function guardarRespuesta(src, r) {
  respuestaUsuario = r;
  analizarImagen(src);
}

// análisis
function analizarImagen(src) {

  const imagen = imagenes.find(i => i.src === src);
  let progreso = 0;

  container.innerHTML = `
    <div class="analysis-container">
      <h2>Analizando...</h2>

      <div class="analysis-image-container">
        <img src="${src}" class="analysis-image">
        <div class="scan-line"></div>
      </div>

      <div class="loader"></div>

      <div class="progress-bar">
        <div id="progress"></div>
      </div>

      <p id="texto" class="ia-text">Iniciando...</p>
    </div>
  `;

  const barra = document.getElementById("progress");
  const texto = document.getElementById("texto");

  const int = setInterval(() => {
    progreso++;
    barra.style.width = progreso + "%";

    if (progreso >= 100) {
      clearInterval(int);
      mostrarResultado(imagen);
    }
  }, 200);

  setInterval(() => {
    texto.innerText = frases[Math.floor(Math.random()*frases.length)];
  }, 2000);
}

// guardar historial
function guardarEnHistorial(imagen, prob) {
  const hist = JSON.parse(localStorage.getItem("historial")) || [];
  hist.push({ ...imagen, prob, fecha: new Date().toLocaleString() });
  localStorage.setItem("historial", JSON.stringify(hist));
}

// resultado
function mostrarResultado(imagen) {

  const prob = Math.floor(Math.random() * 20) + 80;

  // guardar en historial
  guardarEnHistorial(imagen, prob);

  // evaluación usuario
  const correcto = respuestaUsuario === imagen.tipo ? "✔ Correcto" : "❌ Incorrecto";

  // nivel de riesgo
  let riesgo = "";
  let color = "";

  if (imagen.tipo === "LAM" || imagen.tipo === "LAL") {
    riesgo = "ALTA SOSPECHA";
    color = "#ef4444";
  } else {
    riesgo = "BAJA SOSPECHA";
    color = "#22c55e";
  }

  // interpretación clínica dinámica
  let interpretacion = "";

  if (imagen.tipo === "LAM") {
    interpretacion = `
      Los hallazgos morfológicos son compatibles con una proliferación de precursores mieloides,
      sugiriendo una posible leucemia aguda mieloide (LAM), caracterizada por la presencia de blastos 
      con diferenciación granulocítica.
    `;
  } else if (imagen.tipo === "LAL") {
    interpretacion = `
      Se observan características compatibles con linfoblastos, incluyendo alta relación núcleo/citoplasma 
      y cromatina condensada, lo que sugiere una posible leucemia aguda linfoide (LAL).
    `;
  } else {
    interpretacion = `
      La morfología celular observada corresponde a una célula madura, sin evidencia de proliferación blástica,
      lo que descarta una leucemia aguda en esta muestra.
    `;
  }

  container.innerHTML = `
    <div style="background:#1e293b; padding:25px; border-radius:15px; text-align:left;">

      <h2 style="text-align:center;">🧾 Reporte del Sistema IA</h2>

      <hr style="border:1px solid #334155; margin:15px 0;">

      <p><strong>Tipo celular identificado:</strong> ${imagen.blasto}</p>

      <p><strong>Probabilidad diagnóstica:</strong> ${prob}%</p>

      <p>
        <strong>Nivel de sospecha clínica:</strong> 
        <span style="color:${color}; font-weight:bold;">${riesgo}</span>
      </p>

      <p><strong>Diagnóstico sugerido:</strong> ${imagen.tipo}</p>

      <hr style="border:1px solid #334155; margin:15px 0;">

      <p><strong>Evaluación del usuario:</strong></p>
      <p>Tu respuesta: <strong>${respuestaUsuario}</strong></p>
      <p>Resultado: <strong>${correcto}</strong></p>

      <hr style="border:1px solid #334155; margin:15px 0;">

      <p><strong>Interpretación clínica:</strong></p>
      <p>${interpretacion}</p>

      <p><strong>Recomendación diagnóstica:</strong></p>
      <p>
        Se recomienda correlacionar con estudios complementarios como citometría de flujo 
        (marcadores CD13, CD33, CD34 para LAM; CD10, CD19, CD20 para LAL), estudios citogenéticos 
        y evaluación clínica integral del paciente.
      </p>

      <p style="margin-top:20px; color:#facc15;">
        ⚠️ Este sistema corresponde a una simulación educativa basada en inteligencia artificial 
        y no reemplaza el diagnóstico clínico profesional.
      </p>

      <div style="text-align:center; margin-top:20px;">
        <button onclick="verHistorial()">Ver historial</button>
        <button onclick="location.reload()">Nuevo análisis</button>
      </div>

    </div>
  `;
}

// ver historial
function verHistorial() {

  const hist = JSON.parse(localStorage.getItem("historial")) || [];

  container.innerHTML = `
    <h2>Historial</h2>

    ${hist.map(h => `
      <div style="background:#1e293b; margin:10px; padding:10px; border-radius:10px;">
        ${h.blasto} - ${h.tipo} (${h.prob}%)
      </div>
    `).join("")}

    <button onclick="location.reload()">Volver</button>
  `;
}