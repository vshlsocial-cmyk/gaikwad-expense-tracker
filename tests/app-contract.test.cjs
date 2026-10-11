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
  ['row-level security scoped soft delete', /\.update\(\{deleted_at:new Date\(\)\.toISOString\(\),deleted_reason:/],
  ['new purchases eligible for forecast training', /forecast_eligible:true/],
  ['receipt total discrepancy is checked', /receiptTotal[\s\S]*?itemsTotal[\s\S]*?confirm\(/],
  ['receipt mismatch is retained in note', /Receipt total '\+money\(receiptTotal\)/],
  ['forecast engine used by dashboard', /EMSForecast\.predict\(purchases\)/],
  ['manual usage form not exposed as a visible tab', !/data-view="usage"|id="useTab"/.test(html)],
  ['stock view does not claim untracked consumption or stock levels', !/Avg use:|suggested order:|Record usage to unlock/.test(html)],
  ['purchase-pattern screen uses learned forecast', /const pattern=pred\.find/.test(html)],
  ['purchase entry captures brand, variant and pack size', /class="ln-brand"[\s\S]*class="ln-variant"[\s\S]*class="ln-pack"/.test(html)],
  ['purchase edit saves product identity', /brand:\$\('editBrand'\)[\s\S]*variant:\$\('editVariant'\)[\s\S]*pack_size:\$\('editPack'\)/.test(html)],
  ['CSV backup includes product identity columns', /'brand','variant','pack_size'/.test(html)],
  ['adjustment engine loaded by app', /adjustment-engine\.js/.test(html)],
  ['returns and refunds are saved with signed-in user', /purchase_adjustments'\)\.insert\(\{\.\.\.draft,user_id:user\.id/.test(html)],
  ['deleted purchases can be restored with user scoping', /window\.restorePurchase[\s\S]*?update\(\{deleted_at:null,deleted_reason:null\}\)[\s\S]*?\.eq\('user_id',user\.id\)/.test(html)],
  ['purchase adjustment limits are validated before save', /EMSAdjustments\.validate\(p,draft,adjustments\)/.test(html)],
  ['reports subtract refunds in the selected adjustment-date range', /adj=adjustments\.filter\(x=>x\.adjustment_date>=a&&x\.adjustment_date<=b\)/.test(html) && /bought-refund/.test(html)],
  ['CSV backup includes adjustments and deleted purchases', /rows\.push\(\['deleted_purchase'/.test(html) && /rows\.push\(\['adjustment'/.test(html)]
];

for (const [label, check] of required) {
  assert.ok(check instanceof RegExp ? check.test(html) : check, 'Missing contract: ' + label);
}
console.log('EMS app contract checks passed: ' + required.length + ' checks');
