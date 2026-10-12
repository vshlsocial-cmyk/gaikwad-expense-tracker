const assert = require('node:assert/strict');
const { serialize } = require('../backup-engine.js');

const rows = [
 ['type','item','note'],
 ['purchase','Rice','plain'],
 ['purchase','Tea, green','contains, comma'],
 ['purchase','Quote','said "hello"'],
 ['purchase','Line break','first line\nsecond line'],
 ['shop','A short row']
];
const csv = serialize(rows);
const parsedLines = csv.split('\r\n');
assert.equal(parsedLines.length, rows.length, 'one CSV record per input row');
const fields = parsedLines.map(line => {
  const count = (line.match(/,/g) || []).length + 1;
  return count;
});
assert.ok(fields.every(n => n === 3), 'all rows are padded to consistent column count');
assert.ok(csv.includes('"Tea, green","contains, comma"'), 'commas are quoted safely');
assert.ok(csv.includes('"said ""hello"""'), 'embedded quotes are escaped');
assert.ok(csv.includes('"first line\nsecond line"'), 'embedded newlines remain inside quoted cells');
assert.ok(csv.endsWith('"shop","A short row",""'), 'short rows are padded');
assert.equal(serialize([]), '', 'empty input produces empty CSV');
console.log('EMS backup serializer tests passed: 7 assertions');
