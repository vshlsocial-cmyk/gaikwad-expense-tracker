(function(root){
  'use strict';
  function median(values){
    const a=values.filter(Number.isFinite).sort((x,y)=>x-y);
    if(!a.length)return 0;
    const m=Math.floor(a.length/2);
    return a.length%2?a[m]:(a[m-1]+a[m])/2;
  }
  function normalize(unit, quantity){
    const u=String(unit||'piece').trim().toLowerCase(), q=Number(quantity)||0;
    if(['g','gm','gram','grams'].includes(u))return{key:'mass',unit:'kg',quantity:q/1000};
    if(['kg','kgs','kilogram','kilograms'].includes(u))return{key:'mass',unit:'kg',quantity:q};
    if(['ml','millilitre','milliliter','millilitres','milliliters'].includes(u))return{key:'volume',unit:'litre',quantity:q/1000};
    if(['l','ltr','litre','liter','litres','liters'].includes(u))return{key:'volume',unit:'litre',quantity:q};
    return{key:u,unit:u,quantity:q};
  }
  function predict(purchases, adjustments){
    const groups=new Map(), adjByPurchase=new Map();
    (adjustments||[]).forEach(a=>{const k=String(a.purchase_id);if(!adjByPurchase.has(k))adjByPurchase.set(k,{qty:0,refund:0});const z=adjByPurchase.get(k);if(a.physically_returned===true)z.qty+=Math.max(0,Number(a.quantity_returned)||0)});
    (purchases||[]).forEach(p=>{
      const name=String(p.item_name||'').trim();
      if(!name||!p.purchase_date||p.forecast_eligible!==true)return;
      const n=normalize(p.unit,p.quantity),brand=String(p.brand||'').trim(),variant=String(p.variant||'').trim(),pack=String(p.pack_size||'').trim();
      const key=[name.toLocaleLowerCase(),brand.toLocaleLowerCase(),variant.toLocaleLowerCase(),pack.toLocaleLowerCase(),n.key].join('|');
      if(!groups.has(key))groups.set(key,{name,brand,variant,pack_size:pack,unit:n.unit,events:new Map()});
      const g=groups.get(key),date=String(p.purchase_date);
      if(!g.events.has(date))g.events.set(date,{date,qty:0,cost:0});
      const e=g.events.get(date),a=adjByPurchase.get(String(p.id))||{qty:0,refund:0};e.qty+=Math.max(0,n.quantity-Math.min(n.quantity,a.qty));e.cost+=Math.max(0,Number(p.amount||0)-Math.min(Number(p.amount||0),a.refund));
    });
    const out=[];
    groups.forEach(g=>{
      const rows=[...g.events.values()].sort((a,b)=>a.date.localeCompare(b.date));
      if(rows.length<2)return;
      const gaps=[];
      for(let i=1;i<rows.length;i++){
        const d=(new Date(rows[i].date+'T12:00:00')-new Date(rows[i-1].date+'T12:00:00'))/86400000;
        if(d>0)gaps.push(d);
      }
      if(!gaps.length)return;
      const gap=median(gaps),qty=median(rows.map(x=>x.qty)),cost=median(rows.map(x=>x.cost));
      const last=rows[rows.length-1],next=new Date(last.date+'T12:00:00');
      next.setDate(next.getDate()+Math.max(1,Math.round(gap)));
      const nextDate=next.getFullYear()+'-'+String(next.getMonth()+1).padStart(2,'0')+'-'+String(next.getDate()).padStart(2,'0');
      out.push({name:g.name,brand:g.brand,variant:g.variant,pack_size:g.pack_size,unit:g.unit,count:rows.length,gap,qty,cost,dailyCost:cost/gap,weeklyCost:cost/gap*7,monthlyCost:cost/gap*30,yearlyCost:cost/gap*365,last:last.date,next:nextDate,confidence:rows.length>=6?'Higher':rows.length>=4?'Moderate':'Early'});
    });
    return out.sort((a,b)=>a.next.localeCompare(b.next));
  }
  root.EMSForecast={predict,normalize};
  if(typeof module!=='undefined'&&module.exports)module.exports={predict,normalize};
})(typeof globalThis!=='undefined'?globalThis:this);
