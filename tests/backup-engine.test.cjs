const assert = require('node:assert/strict');
const { serialize } = require('../backup-engine.js');

function parseCsv(input) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\r' && input[i + 1] === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      i++;
    } else {
      cell += ch;
    }
  }
  if (row.length || cell.length) {
    row.push(cell);
    rows.push(row);
  }
  assert.equal(quoted, false, 'CSV ends outside a quoted cell');
  return rows;
}

const rows = [
 ['type','item','note'],
 ['purchase','Rice','plain'],
 ['purchase','Tea, green','contains, comma'],
 ['purchase','Quote','said "hello"'],
 ['purchase','Line break','first line\nsecond line'],
 ['shop','A short row']
];
const csv = serialize(rows);
const parsed = parseCsv(csv);
assert.equal(parsed.length, rows.length, 'one CSV record per input row, including embedded newlines');
assert.ok(parsed.every(row => row.length === 3), 'all records have consistent column counts');
assert.deepEqual(parsed.slice(0, rows.length - 1), rows.slice(0, rows.length - 1), 'commas, quotes and embedded newlines round-trip');
assert.deepEqual(parsed.at(-1), ['shop','A short row',''], 'short rows are padded');
assert.equal(serialize([]), '', 'empty input produces empty CSV');
assert.deepEqual(parseCsv(serialize([['',''],['a','b']])), [['',''],['a','b']], 'empty cells round-trip');
console.log('EMS backup serializer tests passed: 6 assertions');
