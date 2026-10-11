const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

const required = [
  ['PWA manifest link', /rel="manifest" href="\.\/manifest\.webmanifest"/],
  ['data loader query count matches six result slots', /const \[p,t,a,u,m,s\]=await Promise\.all\(\[[\s\S]*?db\.from\('shops'\)\.select\('\*'\)\.order\('name'\)\s*\]\)/.test(html)],
  ['searchable purchase history view', /id="view-history"/],
  ['purchase search field', /id="historySearch"/],
  ['edit purchase form', /id="editPurchaseForm"/],
  ['delete action with confirmation', /window\.deletePurchase[\s\S]*?confirm\(/],
  ['row-level security scoped purchase update', /\.update\(changes\)\.eq\('id',id\)\.eq\('user_id',user\.id\)/],
  ['row-level security scoped soft delete', /\.update\(\{deleted_at:new Date\(\)\.toISOString\(\),deleted_reason:/],
  ['new purchases eligible for forecast training', /forecast_eligible:true/],
  ['receipt total discrepancy is checked', /receiptTotal[\s\S]*?itemsTotal[\s\S]*?confirm\(/],
  ['receipt difference is allocated proportionally and rounding remainder assigned', /difference\*x\.amount\/itemsTotal/.test(html) && /difference-allocated/.test(html)],
  ['receipt reconciliation fields are persisted on purchase lines', /item_subtotal:x\.amount[\s\S]*receipt_total:receiptTotal[\s\S]*receipt_adjustment:receiptTotal/ .test(html)],
  ['CSV backup includes receipt reconciliation fields', /'item_subtotal','receipt_total','receipt_items_total','receipt_adjustment','receipt_adjustment_type'/.test(html)],

  ['receipt reconciliation details are persisted on each purchase line', /receipt_total:receiptTotal[\s\S]*receipt_items_total:receiptTotal===null\?null:itemsTotal/],
  ['forecast engine uses return/refund adjustments', /EMSForecast\.predict\(purchases,adjustments\)/],
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
  ['refund category and item attribution includes recycle-bin purchases', /\[\.\.\.purchases,\.\.\.trash\]\.find\(y=>String\(y\.id\)===String\(x\.purchase_id\)\)/.test(html)],
  ['CSV backup includes adjustments and deleted purchases', /rows\.push\(\['deleted_purchase'/.test(html) && /rows\.push\(\['adjustment'/.test(html)],
  ['recycle-bin retention supports 7, 30 and 90 days', /option value="7"/.test(html) && /option value="30"/.test(html) && /option value="90"/.test(html)],
  ['expired recycle-bin cleanup is explicit and confirmed', /cleanupTrash[\s\S]*?confirm\('Permanently remove/.test(html)],
  ['linked adjustment rows are deleted before expired purchase cleanup', /purchase_adjustments'\)\.delete\(\)[\s\S]*?purchases'\)\.delete\(\)/.test(html)]
];

for (const [label, check] of required) {
  assert.ok(check instanceof RegExp ? check.test(html) : check, 'Missing contract: ' + label);
}
console.log('EMS app contract checks passed: ' + required.length + ' checks');
