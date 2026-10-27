// Productos iniciales del catálogo.
// Se guardan en la base de datos solo la primera vez (cuando la tabla está vacía).
// No llevan id porque lo genera la base de datos.
export const PRODUCTOS_INICIALES = [
  // pulseras
  { categoria: 'pulseras', material: 'Macramé', linea: 'Pulsera para compartir', nombre: 'Pulsera con corazón de imán roja', precio: 4000, foto: 'pulsera-roja-iman.jpg', disponible: true },
  { categoria: 'pulseras', material: 'Macramé', linea: 'Pulsera para compartir', nombre: 'Pulsera con corazón de imán morado y blanco', precio: 4000, foto: 'pulsera-morado-blanco-iman.jpg', disponible: true },
  { categoria: 'pulseras', material: 'Macramé', linea: 'Pulsera para compartir', nombre: 'Pulsera con corazón de imán negro', precio: 4000, foto: 'pulsera-negra-blanco-iman.jpg', disponible: true },
  { categoria: 'pulseras', material: 'Macramé', linea: 'Pulsera para compartir', nombre: 'Pulsera con infinito negro', precio: 4000, foto: 'pulsera-negra-infinito.jpg', disponible: true },
  { categoria: 'pulseras', material: 'Macramé', linea: 'Macramé yin yang', nombre: 'Pulsera con yin yang', precio: 4000, foto: 'pulsera-yingyang.jpg', disponible: true },
  { categoria: 'pulseras', material: 'Semillas', linea: 'Pulsera de semillas', nombre: 'Pulsera de Guanacaste', precio: 4000, foto: 'pulsera-semilla-guanacaste.png', disponible: true },
  { categoria: 'pulseras', material: 'Semillas', linea: 'Pulsera de semillas', nombre: 'Pulsera lágrima de San Pedro', precio: 4000, foto: 'pulsera-semilla-lagrimasanpedro.png', disponible: true },
  { categoria: 'pulseras', material: 'Semillas', linea: 'Pulsera de semillas', nombre: 'Pulsera semilla de nene', precio: 4000, foto: 'pulsera-semilla-nene.png', disponible: true },
  { categoria: 'pulseras', material: 'Semillas', linea: 'Pulsera de semillas', nombre: 'Pulsera palma sábal', precio: 4000, foto: 'pulsera-semilla-palmasabal.png', disponible: true },

  // collares
  { categoria: 'collares', material: 'Cuentas', linea: 'Collar con dije de corazón', nombre: 'Corazón azul', precio: 6000, foto: 'collar-corazon-azul.png', disponible: true },
  { categoria: 'collares', material: 'Cuentas', linea: 'Collar con dije de corazón', nombre: 'Corazón verde', precio: 6000, foto: 'collar-corazon-verde.png', disponible: true },
  { categoria: 'collares', material: 'Semillas', linea: 'Semilla de guapinol', nombre: 'Collar y aretes', precio: 6000, foto: 'collar-guapinol.jpg', disponible: true },

  // llaveros
  { categoria: 'llaveros', material: 'Madera', linea: 'Llavero de talla madera', nombre: 'Llavero tabla de surf', precio: 3000, foto: 'llavero-madera-surf.png', disponible: true },
  { categoria: 'llaveros', material: 'Madera', linea: 'Llavero de talla madera', nombre: 'Llavero de Tiburón', precio: 3000, foto: 'llavero-madera-tiburon.png', disponible: true },
  { categoria: 'llaveros', material: 'Semillas', linea: 'Llavero de semillas', nombre: 'Llavero muñeca roja', precio: 3000, foto: 'llavero-muneca-roja.png', disponible: true },
  { categoria: 'llaveros', material: 'Semillas', linea: 'Llavero de semillas', nombre: 'Llavero semilla de guanacaste', precio: 3000, foto: 'llavero-semilla-guanacaste.png', disponible: true },
];
