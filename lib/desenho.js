// Função pura gerarDesenho (número, email), que devolve o texto do SVG
function numeroValido(numero) {
  return Number.isInteger(numero) && numero >= 1 && numero <= 100;
}

function escaparXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function gerarDesenho(numero, email) {
  if (!numeroValido(numero)) {
    throw new Error('Número inválido');
  }

  const k = (numero + 1) / 3;
  const totalPontos = 240;
  const raio = 380;
  const centro = 400;

  let linhas = '';
  for (let i = 0; i < totalPontos; i++) {
    const angulo1 = (i * 2 * Math.PI) / totalPontos;
    const x1 = centro + raio * Math.cos(angulo1);
    const y1 = centro + raio * Math.sin(angulo1);

    const destino = (k * i) % totalPontos;
    const angulo2 = (destino * 2 * Math.PI) / totalPontos;
    const x2 = centro + raio * Math.cos(angulo2);
    const y2 = centro + raio * Math.sin(angulo2);

    const hue = (i / totalPontos) * 360;
    linhas += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="hsl(${hue.toFixed(1)}, 100%, 50%)" stroke-width="0.8" opacity="0.7"/>\n`;
  }

  const emailEscapado = escaparXml(email);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 850" width="100%" height="100%" style="background-color: #0d1117;">
  <style>
    .info { fill: #c9d1d9; font-family: monospace; font-size: 16px; }
    .title { fill: #f0f6fc; font-family: sans-serif; font-size: 20px; font-weight: bold; }
  </style>
  <rect width="100%" height="100%" fill="#0d1117"/>
  <circle cx="${centro}" cy="${centro}" r="${raio}" fill="none" stroke="#30363d" stroke-width="2"/>
  <g>${linhas}</g>
  <text x="40" y="810" class="info">Assinado por: ${emailEscapado}</text>
  <text x="40" y="780" class="title">Tabuada Modular (n = ${numero})</text>
</svg>`;
}
