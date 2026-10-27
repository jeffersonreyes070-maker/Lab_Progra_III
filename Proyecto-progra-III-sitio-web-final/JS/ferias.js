// ferias.js: ferias y puntos de venta

// en mapa va el link de Google Maps
const FERIAS = [
  {
    lugar: 'Feria de Hojancha',
    dias: 'Viernes',
    hora: '8:00 a. m. - 4:30 p. m.',
    direccion: 'Anfiteatro Parque Hojancha, Hojancha, Guanacaste',
    mapa: 'https://maps.app.goo.gl/mS9MRw9GdPj8D55x8'
  },
  {
    lugar: 'Samara Market',
    dias: 'Sábados',
    hora: '7:00 a. m. - 1:00 p. m.',
    direccion: 'Feria Sámara, Sámara, Guanacaste',
    mapa: 'https://maps.app.goo.gl/F7UPR6dRtoswxZD7A'
  }
];

// dibuja una tarjeta por cada feria
function pintarFerias() {
  const lista = document.getElementById('ferias-lista');

  let html = '';
  for (let i = 0; i < FERIAS.length; i++) {
    const f = FERIAS[i];
    html = html +
      '<article class="flex flex-col rounded-2xl border border-guapinol-brown/10 bg-guapinol-light p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">' +
        '<h3 class="text-xl font-semibold font-display">' + f.lugar + '</h3>' +
        '<p class="mt-3 font-medium">' + f.dias + ', ' + f.hora + '</p>' +
        '<p class="mt-1 text-sm text-guapinol-green/80">' + f.direccion + '</p>' +
        '<a href="' + f.mapa + '" target="_blank" rel="noopener" ' +
           'class="mt-auto pt-4 text-sm font-semibold underline decoration-guapinol-primary decoration-2 underline-offset-4 hover:text-guapinol-brown">Ver ubicación en Maps</a>' +
      '</article>';
  }
  lista.innerHTML = html;
}

pintarFerias();
