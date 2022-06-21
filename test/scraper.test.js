const scraper = require('../scraper');
const fs = require('fs');

test('parses a share price table', () => {
  const table = fs.readFileSync('test/table.html', 'utf-8');
  const result = scraper.parse(table);
  expect(result.length).toEqual(37);
  expect(result[0].date).toEqual('2022-06-17');
  expect(result[0].prices['G']).toEqual('16.9104');
});
