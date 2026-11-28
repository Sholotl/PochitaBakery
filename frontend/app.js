'use strict';

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else if (key === 'class') node.className = value;
    else if (value !== false) node.setAttribute(key, value === true ? '' : value);
  }
  node.append(...children);
  return node;
}
const button = (text, action, style = 'link') => el('button',{type:'button',class:style,onclick:action},text);
const field = (title, control) => el('label',{class:'field'}, title, control);
const panel = (...children) => el('section',{class:'panel'},...children);
const money = value => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(value);
const localDate = (day = new Date()) => [day.getFullYear(),String(day.getMonth()+1).padStart(2,'0'),String(day.getDate()).padStart(2,'0')].join('-');
const dateLabel = value => new Date(value+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'});
const transitions = {Pendiente:['En preparación','Cancelado'],'En preparación':['Listo','Cancelado'],Listo:['Entregado','Cancelado'],Entregado:[],Cancelado:[]};
const storageKey = 'pochita-bakery-v2';

function load() {
  const raw = localStorage.getItem(storageKey);
  if (raw) return JSON.parse(raw);
  return {
    customers: JSON.parse(localStorage.getItem('pochita-customers') || '[]'),
    orders: JSON.parse(localStorage.getItem('pochita-orders') || '[]')
  };
}
const main = el('main');
const notice = el('p',{role:'status',class:'notice'});
const nav = el('nav',{'aria-label':'Navegación principal'});
document.body.append(el('header',{},el('div',{class:'bar'},el('div',{class:'brand'},'Pochita ',el('i',{},'Bakery')),nav)),main);
const pages = {inicio:'Inicio',nuevo:'Nuevo pedido',pedidos:'Pedidos',clientes:'Clientes'};
let view = 'inicio', data;
function go(next, message = '') {
  view = next;
  try { data = load(); }
  catch { main.replaceChildren(el('p',{role:'alert'},'No se pudieron leer los datos guardados en este navegador.')); return; }
  nav.replaceChildren(...Object.entries(pages).map(([id,label]) => {
    const tab = button(label,()=>go(id));
    if(id === view) tab.setAttribute('aria-current','page');
    return tab;
  }));
  notice.textContent = message;
  main.replaceChildren(notice);
  ({inicio:home,nuevo:newOrder,pedidos:orderList,clientes:directory})[view]();
}
async function change(edit, next, message) {
  try {
    const commit = () => {
      const latest = load();
      edit(latest);
      localStorage.setItem(storageKey,JSON.stringify(latest));
    };
    if (navigator.locks) await navigator.locks.request(storageKey,commit);
    else commit();
    go(next,message);
  } catch (error) {
    notice.textContent = error instanceof RangeError ? error.message : 'No se pudo guardar. Revisa el almacenamiento de tu navegador.';
    notice.scrollIntoView({block:'nearest'});
  }
}
const customerName = id => data.customers.find(c=>c.id===id)?.name || 'Cliente';
function home() {
  const active = data.orders.filter(o=>!['Cancelado','Entregado'].includes(o.status));
  const metrics = [
    ['Pedidos activos',active.length],
    ['Clientes registrados',data.customers.length],
    ['Importe de pedidos',money(data.orders.filter(o=>o.status!=='Cancelado').reduce((sum,o)=>sum+o.total,0))]
  ];
  main.append(el('section',{class:'hero'},
    el('div',{class:'herocopy'},el('span',{class:'kicker'},'Mesa de pedidos'),
      el('h1',{},'Pasteles ',el('br'),el('i',{},'a la medida.')),button('Crear pedido  ↗',()=>go('nuevo'),'primary')),
    el('img',{src:'assets/pastel.jpg',alt:'Pastel de crema con frambuesas y cerezas'})),
    el('div',{class:'metrics'},...metrics.map(([label,value])=>el('div',{class:'metric'},el('span',{class:'muted'},label),el('strong',{class:'amount'},String(value))))),
    panel(el('div',{class:'heading'},el('h2',{},'Pedidos recientes'),button('Ver todos',()=>go('pedidos'))),orderTable(data.orders.slice(-5).reverse())));
}
function table(cols,rows) {
  return el('div',{class:'scroll'},el('table',{},el('thead',{},el('tr',{},...cols.map(col=>el('th',{scope:'col'},col)))),
    el('tbody',{},...rows.map(row=>el('tr',{},...row.map(cell=>el('td',{},cell)))))));
}
function statusControl(order) {
  const allowed = transitions[order.status] || [];
  const control = el('select',{'aria-label':'Estado del pedido '+order.id,disabled:!allowed.length},
    ...[order.status,...allowed].map(s=>el('option',{value:s},s)));
  control.onchange = () => {
    const target = control.value;
    control.value = order.status;
    change(latest=>{
      const current = latest.orders.find(o=>o.id===order.id);
      if (!current || !transitions[current.status]?.includes(target)) throw new RangeError('El estado cambió. Vuelve a abrir Pedidos.');
      current.status = target;
    },view,'Estado actualizado.');
  };
  return control;
}
function orderTable(list) {
  if (!list.length) return el('p',{class:'empty'},data.orders.length?'No hay pedidos que coincidan.':'Aquí aparecerán tus pedidos al confirmar el primero.');
  return table(['Folio','Cliente','Entrega','Pastel','Total','Estado'],list.map(o=>[
    '#'+o.id,customerName(o.customerId),dateLabel(o.date),
    el('details',{},el('summary',{},o.cake.flavor+' · '+o.cake.size),...Object.entries(catalogo).map(([key,group])=>el('div',{},group.label+' · '+o.cake[key]))),
    money(o.total),statusControl(o)]));
}
function orderList() {
  const search = el('input',{type:'search',class:'search',placeholder:'Buscar por folio, cliente o estado','aria-label':'Buscar pedidos'});
  const results = el('div');
  const filter = () => {
    const term = search.value.trim().toLocaleLowerCase();
    results.replaceChildren(orderTable(data.orders.filter(o=>[o.id,customerName(o.customerId),o.status].join(' ').toLocaleLowerCase().includes(term)).reverse()));
  };
  search.oninput = filter; filter();
  main.append(el('h1',{},'Pedidos'),panel(search,results));
}
function contactFields() {
  return el('div',{class:'fields'},field('Nombre',el('input',{name:'name',required:true,maxlength:100,autocomplete:'name'})),
    field('Teléfono',el('input',{name:'phone',required:true,type:'tel',maxlength:22,autocomplete:'tel'})));
}
function addClient(latest, form) {
  const name = form.get('name').trim();
  const original = form.get('phone').trim();
  const phone = original.replace(/\D/g,'');
  if (!name || !/^[+\d()\s-]+$/.test(original) || !/^\d{7,15}$/.test(phone)) throw new RangeError('Escribe un nombre y un teléfono de 7 a 15 dígitos.');
  if (latest.customers.some(c=>c.phone.replace(/\D/g,'')===phone)) throw new RangeError('Ese teléfono ya está registrado. Selecciona al cliente existente.');
  const id = crypto.randomUUID();
  latest.customers.push({id,name,phone});
  return id;
}
function directory() {
  const form = el('form',{},contactFields(),el('p',{},el('button',{class:'primary'},'Guardar cliente')));
  form.onsubmit = event => {
    event.preventDefault();
    const values = new FormData(form);
    change(latest=>addClient(latest,values),'clientes','Cliente guardado.');
  };
  main.append(el('h1',{},'Clientes'),panel(el('h2',{},'Registrar cliente'),form),
    panel(el('h2',{},'Directorio'),data.customers.length?table(['Nombre','Teléfono','Pedidos'],data.customers.map(c=>[
      c.name,c.phone,String(data.orders.filter(o=>o.customerId===c.id).length)])):el('p',{class:'empty'},'Aún no hay clientes registrados.')));
}
function newOrder() {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const select = el('select',{name:'customerId'},...data.customers.map(c=>el('option',{value:c.id},c.name+' · '+c.phone)),el('option',{value:'new'},'Registrar cliente nuevo'));
  const contact = contactFields();
  const toggleContact = () => {
    contact.hidden = select.value !== 'new';
    contact.querySelectorAll('input').forEach(i=>i.disabled=contact.hidden);
  };
  select.onchange = toggleContact; toggleContact();
  const options = Object.entries(catalogo).map(([key,group])=>field(group.label,el('select',{name:key},...Object.keys(group.tarifas).map(v=>el('option',{value:v},v)))));
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 335 260');
  svg.setAttribute('role','img');
  const caption = el('figcaption',{'aria-live':'polite'});
  const preview = el('figure',{class:'cake-preview'},el('h2',{},'Tu pastel'),svg,caption);
  const receipt = el('aside',{class:'panel receipt','aria-label':'Cotización'});
  const form = el('form',{class:'panel'},el('fieldset',{},el('legend',{},'Personaliza el pastel'),el('div',{class:'fields'},...options)),
    el('fieldset',{},el('legend',{},'Datos de entrega'),el('div',{class:'fields'},
      field('Cliente',select),field('Fecha de entrega',el('input',{type:'date',name:'date',required:true,min:localDate(tomorrow)}))),contact),
    el('button',{class:'primary'},'Confirmar pedido'));
  const configuration = () => Object.fromEntries(Object.keys(catalogo).map(k=>[k,form.elements[k].value]));
  const update = () => {
    const cake = configuration();
    renderCakePreview(svg,cake);
    caption.textContent = 'Pan de '+cake.flavor.toLocaleLowerCase()+' · '+cake.cover;
    receipt.replaceChildren(el('h2',{},'Cotización'),...Object.entries(catalogo).map(([key,group])=>
      el('div',{class:'row'},el('div',{},el('small',{},group.label),el('div',{},cake[key])),money(group.tarifas[cake[key]]))),
      el('div',{class:'row total','aria-live':'polite'},'Total MXN',money(cotizar(cake))));
  };
  form.onchange = update; update();
  form.onsubmit = event => {
    event.preventDefault();
    const values = new FormData(form), cake = configuration();
    if(values.get('date')<=localDate()) { notice.textContent='Selecciona una fecha posterior a hoy.'; return; }
    change(latest=>{
      const customerId = select.value==='new'?addClient(latest,values):values.get('customerId');
      if (!latest.customers.some(c=>c.id===customerId)) throw new RangeError('Selecciona un cliente registrado.');
      let number = latest.orders.length+1;
      while(latest.orders.some(o=>o.id==='PB-'+String(number).padStart(4,'0'))) number++;
      latest.orders.push({id:'PB-'+String(number).padStart(4,'0'),customerId,date:values.get('date'),cake,total:cotizar(cake),status:'Pendiente'});
    },'pedidos','Pedido registrado con su precio acordado.');
  };
  main.append(el('h1',{},'Nuevo pedido'),el('div',{class:'split builder'},form,el('div',{class:'preview-column'},preview,receipt)));
}
go('inicio');
