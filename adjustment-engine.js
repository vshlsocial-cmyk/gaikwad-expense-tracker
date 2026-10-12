(function(root){
 'use strict';
 function summarize(purchase, adjustments){
  const rows=(adjustments||[]).filter(a=>String(a.purchase_id)===String(purchase.id));
  const returned=rows.filter(a=>a.physically_returned===true).reduce((s,a)=>s+Math.max(0,Number(a.quantity_returned)||0),0);
  const refunded=rows.reduce((s,a)=>s+Math.max(0,Number(a.refund_amount)||0),0);
  const quantity=Math.max(0,Number(purchase.quantity)||0);
  const amount=Math.max(0,Number(purchase.amount)||0);
  return {returnedQuantity:returned,retainedQuantity:Math.max(0,quantity-returned),refundAmount:refunded,netSpend:Math.max(0,amount-refunded),overReturned:returned>quantity+1e-9,overRefunded:refunded>amount+0.01};
 }
 function validate(purchase, adjustment, prior){
  const qty=Math.max(0,Number(purchase.quantity)||0), amount=Math.max(0,Number(purchase.amount)||0);
  const q=Math.max(0,Number(adjustment.quantity_returned)||0), r=Math.max(0,Number(adjustment.refund_amount)||0);
  const all=[...(prior||[]),adjustment].filter(a=>String(a.purchase_id)===String(purchase.id));
  const returned=all.filter(a=>a.physically_returned===true).reduce((s,a)=>s+Math.max(0,Number(a.quantity_returned)||0),0);
  const refunded=all.reduce((s,a)=>s+Math.max(0,Number(a.refund_amount)||0),0);
  if(!['return','refund','return_and_refund'].includes(adjustment.adjustment_type))return {ok:false,reason:'Choose a valid adjustment type.'};
  if(q<0||r<0||!Number.isFinite(q)||!Number.isFinite(r))return {ok:false,reason:'Quantity and refund must be valid non-negative numbers.'};
  if(adjustment.physically_returned && q<=0)return {ok:false,reason:'A physical return needs a quantity greater than zero.'};
  if(!adjustment.physically_returned && q>0)return {ok:false,reason:'Returned quantity requires confirmation that goods were physically returned.'};
  if(adjustment.adjustment_type==='return'&&(!adjustment.physically_returned||r!==0))return {ok:false,reason:'A return-only record needs returned quantity and no refund amount.'};
  if(adjustment.adjustment_type==='refund'&&(r<=0||adjustment.physically_returned||q!==0))return {ok:false,reason:'Refund-only records need a refund amount and must not mark goods returned.'};
  if(adjustment.adjustment_type==='return_and_refund'&&(!adjustment.physically_returned||q<=0||r<=0))return {ok:false,reason:'Return and refund needs both a returned quantity and a refund amount.'};
  if(returned>qty+1e-9)return {ok:false,reason:'Returned quantity exceeds the original purchase quantity.'};
  if(refunded>amount+0.01)return {ok:false,reason:'Total refunds exceed the original purchase amount.'};
  return {ok:true,reason:''};
 }
 root.EMSAdjustments={summarize,validate};
 if(typeof module!=='undefined'&&module.exports)module.exports={summarize,validate};
})(typeof globalThis!=='undefined'?globalThis:this);
