const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

const required = [
  ['PWA manifest link', /rel="manifest" href="\.\/manifest\.webmanifest"/],
  ['searchable purchase history view', /id="view-history"/],
  ['purchase search field', /id="historySearch"/],
  ['edit purchase form', /id="editPurchaseForm"/],
  ['delete action with confirmation', /window\.deletePurchase[\s\S]*?confirm\(/],
  ['row-level security scoped purchase update', /\.update\(changes\)\.eq\('id',id\)\.eq\('user_id',user\.id\)/],
  ['row-level security scoped purchase delete', /\.delete\(\)\.eq\('id',p\.id\)\.eq\('user_id',user\.id\)/],
  ['new purchases eligible for forecast training', /forecast_eligible:true/],
  ['receipt total discrepancy is checked', /receiptTotal[\s\S]*?itemsTotal[\s\S]*?confirm\(/],
  ['receipt mismatch is retained in note', /Receipt total '\+money\(receiptTotal\)/],
  ['forecast engine used by dashboard', /EMSForecast\.predict\(purchases\)/],
  ['manual usage form not exposed as a visible tab', !/data-view="usage"|id="useTab"/.test(html)]
];

for (const [label, check] of required) {
  assert.ok(check instanceof RegExp ? check.test(html) : check, 'Missing contract: ' + label);
}
console.log('EMS app contract checks passed: ' + required.length + ' checks');
