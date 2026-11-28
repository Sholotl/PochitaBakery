'use strict';

// Vector illustration in a fixed coordinate system; the same configuration
// drives this illustration, the price breakdown and the saved order.
function cakeArtwork(cake) {
  const crumb = {Vainilla:'#e8bb7b', Limón:'#ebce61', Chocolate:'#67412e', Fresa:'#d9868f', 'Red velvet':'#9b3943'}[cake.flavor];
  const [light, middle, shade] = {
    Chantillí:['#fffdf7','#f7efe1','#d9cab8'],
    Buttercream:['#fff1c6','#ecd39d','#c1a171'],
    Fondant:['#ffebea','#e9b8ba','#bf8e94']
  }[cake.cover];
  const size = {Chico:.77, Mediano:.85, Grande:.93, Extragrande:1}[cake.size];
  const ellipse = (x,y,rx,ry,color) => '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+color+'"/>';
  function outline() {
    if (cake.shape==='Cuadrado') return 'M-90 -10 L15 -34 L90 8 L-15 32 Z';
    if (cake.shape==='Corazón') return 'M0 36 C-19 24 -96 9 -88 -12 C-81 -37 -24 -39 0 -18 C27 -41 80 -35 88 -15 C101 6 35 29 0 36Z';
    if (cake.shape==='Redondo') return 'M-92 0 A92 31 0 1 0 92 0 A92 31 0 1 0 -92 0Z';
    const points=[];
    const star=cake.shape==='Estrella';
    const count=star?10:120;
    for(let i=0;i<count;i++){
      const angle=i*2*Math.PI/count-Math.PI/2;
      const r=star?(i%2?.48:1):.85+.15*Math.cos(6*angle);
      points.push((i?'L':'M')+(94*r*Math.cos(angle)).toFixed(2)+' '+(34*r*Math.sin(angle)).toFixed(2));
    }
    return points.join(' ')+'Z';
  }
  const path=outline();
  function topping(x,y,i) {
    if(cake.toppings==='Fruta fresca') return ellipse(x,y,6,4.7,'#a93148')+ellipse(x-1.5,y-2,1.7,1,'#f7b7a8')+ellipse(x+2,y-4.4,2.8,1.1,'#688052');
    if(cake.toppings==='Galletas') return ellipse(x,y,7,4.8,'#ad7549')+ellipse(x,y-1,6.5,4,'#dbab72')+ellipse(x-2,y-1,1,1,'#694734')+ellipse(x+2,y,1.2,1,'#694734');
    if(cake.toppings==='Chispas de chocolate') return '<path d="M'+(x-3)+' '+y+'q2 -2 3 -6q1 4 3 6q-3 3 -6 0" fill="#513126"/>';
    if(cake.toppings==='Granillo') return '<path d="M'+x+' '+y+'l3 1.4" stroke="'+['#b83b57','#568883','#e5a448','#b78cbe'][i%4]+'" stroke-width="2.4" stroke-linecap="round"/>';
    return '';
  }
  function tier(scale,baseline,decorate) {
    let body='';
    // Overlapping translated contours form continuous vertical walls for
    // concave shapes as well as round tiers.
    for(let y=40;y>=1;y--) body+='<path d="'+path+'" transform="translate(0 '+y+')" fill="url(#icing-wall)"/>';
    if(cake.cover!=='Fondant'){
      for(const y of (cake.cover==='Chantillí'?[10,19,28,37]:[33,37])){
        body+='<path d="'+path+'" transform="translate(0 '+y+')" fill="none" stroke="'+shade+'" stroke-width="1" opacity=".46"/>';
      }
    }
    body+='<path d="'+path+'" fill="url(#icing-top)" stroke="'+shade+'" stroke-width=".8"/>';
    if(decorate){
      const count=cake.toppings==='Granillo'?55:14;
      for(let i=0;i<count;i++){
        const angle=i*2.39996;
        const radius=Math.sqrt((i+.5)/count);
        const x=42*radius*Math.cos(angle),y=12*radius*Math.sin(angle)+(cake.shape==='Corazón'?8:0);
        body+=topping(x,y,i);
      }
    }
    return '<g transform="translate(144 '+baseline+') scale('+scale+')">'+body+'</g>';
  }
  let levels='',base=197;
  for(let i=0;i<Number(cake.floors);i++){
    const scale=size*(1-.22*i);
    const top=base-40*scale;
    levels+=tier(scale,top,i===Number(cake.floors)-1);
    base=top;
  }
  let pores='';
  for(let i=0;i<38;i++) pores+=ellipse(2+(i*37%51),5+(i*13%29),i%3===0?1.1:.6,.6,'#74462e');
  const slice='<g transform="translate(247 190)">'+ellipse(29,41,40,5,'#e4d2c2')+
    '<path d="M0 0L58 4V40L0 34Z" fill="'+crumb+'"/><g opacity=".35">'+pores+'</g>'+
    '<path d="M0 12l58 5v3L0 15ZM0 23l58 5v3L0 26Z" fill="'+light+'"/>'+
    '<path d="M0 -3L22 -13L59 1L58 6L0 1Z" fill="'+light+'"/><path d="M58 5l4 -3v36l-4 3Z" fill="'+middle+'"/></g>';
  return '<defs><linearGradient id="icing-wall"><stop stop-color="'+shade+'"/><stop offset=".37" stop-color="'+middle+'"/><stop offset=".65" stop-color="'+light+'"/><stop offset="1" stop-color="'+shade+'"/></linearGradient><linearGradient id="icing-top" x2=".3" y2="1"><stop stop-color="'+light+'"/><stop offset="1" stop-color="'+middle+'"/></linearGradient></defs>'+
    ellipse(144,225,106,10,'#e8d9cc')+'<path d="M131 200h26l4 17q3 3 18 5q2 6 -35 6t-35 -6q16 -2 19 -5Z" fill="#cfbead"/>'+
    ellipse(144,201,113,32,'#cebdac')+ellipse(144,197,114,32,'#f6eee3')+levels+slice;
}
function renderCakePreview(svg,cake){
  svg.innerHTML=cakeArtwork(cake);
  svg.setAttribute('aria-label',[cake.shape,cake.size,cake.floors+' piso(s)',cake.flavor,cake.cover,cake.toppings].join(', '));
}
