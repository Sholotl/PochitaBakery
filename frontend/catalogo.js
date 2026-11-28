'use strict';
// Importes de los seis componentes de Cake.java. El mínimo ya incluye
// sabor, cobertura y tamaño; no se agrega un precio base adicional.
const catalogo = {
  flavor: {label:'Sabor', tarifas:{Vainilla:70, Limón:80, Chocolate:100, Fresa:110, 'Red velvet':130}},
  cover: {label:'Cobertura', tarifas:{Chantillí:80, Buttercream:110, Fondant:150}},
  toppings: {label:'Decoración', tarifas:{Ninguna:0, Granillo:20, 'Fruta fresca':80, 'Chispas de chocolate':50, Galletas:60}},
  shape: {label:'Forma', tarifas:{Redondo:0, Cuadrado:20, Corazón:40, Estrella:80, Flor:100}},
  size: {label:'Tamaño', tarifas:{Chico:100, Mediano:180, Grande:280, Extragrande:350}},
  floors: {label:'Pisos', tarifas:{1:0, 2:100, 3:200}}
};
function cotizar(pastel) {
  return Object.entries(catalogo).reduce((total,[clave,grupo]) => {
    if (!Object.hasOwn(grupo.tarifas,pastel[clave])) throw new Error('Opción de pastel inválida');
    return total + grupo.tarifas[pastel[clave]];
  },0);
}
