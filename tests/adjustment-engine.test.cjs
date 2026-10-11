const assert = require('node:assert/strict');
const {summarize, validate} = require('../adjustment-engine.js');
const purchase = {id:7,quantity:5,amount:100};
const prior = [
 {purchase_id:7,adjustment_type:'return_and_refund',quantity_returned:1,refund_amount:20,physically_returned:true},
 {purchase_id:7,adjustment_type:'refund',quantity_returned:0,refund_amount:10,physically_returned:false}
];
const summary = summarize(purchase,prior);
assert.equal(summary.returnedQuantity,1,'physical returns reduce retained quantity');
assert.equal(summary.retainedQuantity,4,'remaining quantity is bounded by original quantity');
assert.equal(summary.refundAmount,30,'refund-only and return refunds both reduce net spend');
assert.equal(summary.netSpend,70,'net spend subtracts refunds');
assert.equal(validate(purchase,{purchase_id:7,adjustment_type:'return_and_refund',quantity_returned:5,refund_amount:15,physically_returned:true},prior).ok,false,'cannot over-return cumulative quantity');
assert.equal(validate(purchase,{purchase_id:7,adjustment_type:'refund',quantity_returned:0,refund_amount:75,physically_returned:false},prior).ok,false,'cannot over-refund cumulative amount');
assert.equal(validate(purchase,{purchase_id:7,adjustment_type:'refund',quantity_returned:0,refund_amount:5,physically_returned:false},prior).ok,true,'refund-only does not imply physical return');
assert.equal(validate(purchase,{purchase_id:7,adjustment_type:'return',quantity_returned:1,refund_amount:0,physically_returned:true},prior).ok,true,'physical return can happen without a refund');
assert.equal(validate(purchase,{purchase_id:7,adjustment_type:'return',quantity_returned:1,refund_amount:0,physically_returned:false},prior).ok,false,'return requires physical return confirmation');
console.log('EMS adjustment engine tests passed: 9 assertions');
