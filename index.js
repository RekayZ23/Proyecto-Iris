// Clasificador de Iris con TensorFlow.js
// El modelo fue entrenado en Keras (entrenar.py) y convertido con tensorflowjs_converter.

const CLASES = ['setosa', 'versicolor', 'virginica'];

const btn = document.getElementById('btn');
const estado = document.getElementById('estado');
const resultado = document.getElementById('resultado');

let model;

async function cargarModelo() {
  try {
    model = await tf.loadLayersModel('modelo/model.json');
    btn.disabled = false;
    estado.textContent = 'Modelo cargado. Ingresa las medidas y presiona Clasificar.';
  } catch (error) {
    console.error(error);
    estado.textContent = 'No se pudo cargar el modelo. Abre la página desde un servidor local, no con doble clic.';
  }
}

function leerMedidas() {
  const ids = ['sl', 'sw', 'pl', 'pw'];
  const valores = ids.map(id => parseFloat(document.getElementById(id).value));
  return valores.some(v => Number.isNaN(v)) ? null : valores;
}

async function clasificar() {
  const medidas = leerMedidas();

  if (!medidas) {
    resultado.className = '';
    resultado.textContent = 'Completa las cuatro medidas con números.';
    return;
  }

  const muestra = tf.tensor2d([medidas]);          // lote de 1 muestra con 4 atributos
  const prediccion = model.predict(muestra);        // probabilidades (softmax)
  const probabilidades = await prediccion.data();
  const indice = prediccion.argMax(1).dataSync()[0];

  const detalle = CLASES
    .map((nombre, i) => `${nombre}: ${(probabilidades[i] * 100).toFixed(1)}%`)
    .join('  ·  ');

  resultado.className = 'ok';
  resultado.innerHTML =
    `<div class="especie">Iris ${CLASES[indice]}</div>` +
    `<div class="probs">${detalle}</div>`;

  muestra.dispose();
  prediccion.dispose();
}

btn.addEventListener('click', clasificar);
cargarModelo();
