const assert = require('node:assert/strict');
const {predict, normalize} = require('../forecast-engine.js');

assert.equal(normalize('g', 500).quantity, 0.5, 'grams normalize to kg');
assert.equal(normalize('ml', 750).quantity, 0.75, 'millilitres normalize to litres');
assert.equal(normalize('bottle', 2).key, 'bottle', 'unknown package units stay separate');

const rows = [
  {item_name:'Rice', purchase_date:'2026-01-01', quantity:500, unit:'g', amount:40},
  {item_name:'Rice', purchase_date:'2026-01-01', quantity:500, unit:'g', amount:40},
  {item_name:'Rice', purchase_date:'2026-01-11', quantity:1, unit:'kg', amount:82},
  {item_name:'Rice', purchase_date:'2026-01-31', quantity:1, unit:'kg', amount:85}
];
const predictions = predict(rows.map(x => ({...x, forecast_eligible:true})));
assert.equal(predictions.length, 1, 'same product and compatible units form one history');
assert.equal(predictions[0].count, 3, 'same-day basket lines aggregate into one purchase date');
assert.equal(predictions[0].gap, 15, 'median purchase interval is used');
assert.equal(predictions[0].unit, 'kg', 'mass output unit is kg');
assert.equal(predict([{item_name:'Milk',purchase_date:'2026-01-01',quantity:1,unit:'litre',amount:50,forecast_eligible:true}]).length, 0, 'one purchase date is not enough');
assert.equal(predict([
 {item_name:'Oil',purchase_date:'2026-01-01',quantity:1,unit:'bottle',amount:100,forecast_eligible:true},
 {item_name:'Oil',purchase_date:'2026-01-10',quantity:1,unit:'litre',amount:100,forecast_eligible:true}
]).length, 0, 'bottle and litre units are not silently combined');
assert.equal(predict(rows.map(x => ({...x,forecast_eligible:false}))).length, 0, 'historical purchases are excluded from training');
console.log('EMS forecast tests passed: 10 assertions');
