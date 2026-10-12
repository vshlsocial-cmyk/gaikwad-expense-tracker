(function(root){
 'use strict';
 function serialize(rows){
  const source=Array.isArray(rows)?rows:[];
  const width=source.reduce((max,row)=>Math.max(max,Array.isArray(row)?row.length:0),0);
  return source.map(row=>{
   const cells=Array.isArray(row)?row:[];
   return Array.from({length:width},(_,i)=>'"'+String(cells[i]??'').replace(/"/g,'""')+'"').join(',');
  }).join('\r\n');
 }
 root.EMSBackup={serialize};
 if(typeof module!=='undefined'&&module.exports) module.exports=root.EMSBackup;
})(typeof globalThis!=='undefined'?globalThis:this);
