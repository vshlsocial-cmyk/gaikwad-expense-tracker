(function(root){
'use strict';
function allocate(items, receiptTotal){
 if(!Array.isArray(items)||!items.length) throw new Error('At least one item is required.');
 const cents=n=>Math.round((Number(n)+Number.EPSILON)*100);
 const amounts=items.map(x=>Number(x.amount));
 if(amounts.some(n=>!Number.isFinite(n)||n<0)) throw new Error('Item amounts must be finite and non-negative.');
 const totalCents=amounts.reduce((s,n)=>s+cents(n),0);
 if(receiptTotal===null||receiptTotal===undefined||receiptTotal===''){
  return {items:items.map((x,i)=>({...x,amount:cents(amounts[i])/100,receipt_adjustment:0})),itemsTotal:totalCents/100,receiptTotal:null,difference:0};
 }
 const receiptCents=cents(receiptTotal);
 if(!Number.isFinite(Number(receiptTotal))||receiptCents<0) throw new Error('Receipt total must be finite and non-negative.');
 const diff=receiptCents-totalCents;
 if(totalCents===0&&diff!==0) throw new Error('A non-zero receipt difference cannot be allocated across zero-priced items.');
 let allocated=0;
 const result=items.map((x,i)=>{
  const adj=i===items.length-1?diff-allocated:(totalCents===0?0:Math.round(diff*cents(amounts[i])/totalCents));
  allocated+=adj;
  const net=cents(amounts[i])+adj;
  if(net<0) throw new Error('Allocated discount exceeds an item price.');
  return {...x,amount:net/100,receipt_adjustment:adj/100};
 });
 if(result.reduce((s,x)=>s+cents(x.amount),0)!==receiptCents) throw new Error('Allocated item totals do not reconcile to receipt total.');
 return {items:result,itemsTotal:totalCents/100,receiptTotal:receiptCents/100,difference:diff/100};
}
const api={allocate};
if(typeof module!=='undefined'&&module.exports) module.exports=api;
root.EMSReceipt=api;
})(typeof globalThis!=='undefined'?globalThis:this);
