const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

const required = [
  ['service worker cache version is explicitly versioned and old caches are removed', /const CACHE_NAME = "ems-shell-v2"/.test(fs.readFileSync('sw.js','utf8')) && /keys\.filter\(key => key\.startsWith\("ems-shell-"\) && key !== CACHE_NAME\)/.test(fs.readFileSync('sw.js','utf8'))],
  ['PWA manifest link', /rel="manifest" href="\.\/manifest\.webmanifest"/],
  ['seven-tab navigation remains horizontally scrollable on narrow screens', /\.nav\\\{display:flex;gap:5px;position:sticky;top:0;background:var\\\(--bg\\\);z-index:5;padding:8px 0;overflow-x:auto/.test(html) && /\.nav button\\\{flex:1 0 72px/.test(html)],
  ['data loader query count matches six result slots', /const \[p,t,a,u,m,s\]=await Promise\.all\(\[[\s\S]*?db\.from\('shops'\)\.select\('\*'\)\.order\('name'\)\s*\]\)/.test(html)],
  ['shopping planner view is present', /id="view-planner"/.test(html)],
  ['shopping planner offers retailer search links without claiming live price verification', /function retailerSearchLinks\(query, location\)/.test(html) && (html.match(/retailerSearchLinks\(query, selectedLocation\)/g)||[]).length===3 && /Check current listings manually/.test(html) && /no live retailer offers/.test(html)],
  ['saved delivery locations UI and account-scoped table are wired', /id="deliveryLocations"/.test(html) && /from\('delivery_locations'\)/.test(html) && /user_id:user.id,label,address/.test(html)],
  ['planner does not claim saved locations verify serviceability', /does not verify serviceability/.test(html)],
  ['shopping planner labels comparisons as historical rather than live', /historical references, not live retailer prices/.test(html) && /no live retailer offers/.test(html)],
  ['shopping planner normalizes names and preserves distinct product identities', /normalize\('NFKD'\)\.replace\(\/\[\\u0300-\\u036f\]\//.test(html) && /will not merge brands, variants or pack sizes/.test(html)],
  ['shopping planner displays recorded brand variant and pack details', /identity:\[chosen\.p\.brand,chosen\.p\.variant,chosen\.p\.pack_size\]/.test(html) && /x\.identity\?esc\(x\.identity\)/.test(html)],
  ['PDF print action refreshes report and includes selected date range', /id="printRange"/.test(html) && /printReport'\)\.onclick=\(\)=>\{renderReport\(\);go\('reports'\);window\.print\(\)\}/.test(html)],
  ['searchable purchase history view', /id="view-history"/],
  ['purchase search field', /id="historySearch"/],
  ['edit purchase form', /id="editPurchaseForm"/],
  ['delete action with confirmation', /window\.deletePurchase[\s\S]*?confirm\(/],
  ['row-level security scoped purchase update', /\.update\(changes\)\.eq\('id',id\)\.eq\('user_id',user\.id\)/],
  ['row-level security scoped soft delete', /\.update\(\{deleted_at:new Date\(\)\.toISOString\(\),deleted_reason:/],
  ['new purchases eligible for forecast training', /forecast_eligible:true/],
  ['receipt total discrepancy is checked', /receiptTotal[\s\S]*?itemsTotal[\s\S]*?confirm\(/],
  ['receipt allocation engine is loaded and used', /receipt-engine\.js/.test(html) && /EMSReceipt\.allocate\(lines,receiptTotal\)/.test(html)],
  ['receipt reconciliation fields are persisted on purchase lines', /item_subtotal:x\.amount-x\.receipt_adjustment[\s\S]*receipt_total:receiptTotal[\s\S]*receipt_adjustment:receiptTotal/ .test(html)],
  ['CSV backup uses dedicated serializer', /EMSBackup\.serialize\(rows\)/.test(html) && /backup-engine\.js/.test(html)],
  ['CSV backup includes receipt reconciliation fields', /'item_subtotal','receipt_total','receipt_items_total','receipt_adjustment','receipt_adjustment_type'/.test(html)],
  ['CSV backup includes saved family members, shops and delivery locations', /members\.forEach\(x=>\{const row=Array\(26\)\.fill\(''\);row\[0\]='family_member'/.test(html) && /shops\.forEach\(x=>\{const row=Array\(26\)\.fill\(''\);row\[0\]='shop'/.test(html) && /locations\.forEach\(x=>\{const row=Array\(26\)\.fill\(''\);row\[0\]='delivery_location'/.test(html)],

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
  ['date-range reports keep refunds in a separate adjustment-date bucket', /cats\['Refunds'\]=\(cats\['Refunds'\]\|\|0\)-refundAmount/.test(html) && /items\['Refunds \/ adjustments'\]=\(items\['Refunds \/ adjustments'\]\|\|0\)-refundAmount/.test(html)],
  ['CSV backup includes adjustments and deleted purchases', /rows\.push\(\['deleted_purchase'/.test(html) && /rows\.push\(\['adjustment'/.test(html)],
  ['recycle-bin retention supports 7, 30 and 90 days', /option value="7"/.test(html) && /option value="30"/.test(html) && /option value="90"/.test(html)],
  ['expired recycle-bin cleanup is explicit and confirmed', /cleanupTrash[\s\S]*?confirm\('Permanently remove/.test(html)],
  ['linked adjustment rows are deleted before expired purchase cleanup', /purchase_adjustments'\)\.delete\(\)[\s\S]*?purchases'\)\.delete\(\)/.test(html)]
];

for (const [label, check] of required) {
  assert.ok(check instanceof RegExp ? check.test(html) : check, 'Missing contract: ' + label);
}
console.log('EMS app contract checks passed: ' + required.length + ' checks');
