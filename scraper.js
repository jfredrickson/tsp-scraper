#!/usr/bin/env node

const { chromium } = require('playwright');
const cheerio = require('cheerio');
const dayjs = require('dayjs');

const SHARE_PRICE_URL = 'https://www.tsp.gov/fund-performance/share-price-history/';
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0';

function parse(table) {
  const $ = cheerio.load(table, {}, false);

  // Extract fund names from table heading
  const fundNames = [];
  $("thead th").slice(1).each((_, heading) => {
    const fund = $(heading).text().replace('Fund', '').trim();
    fundNames.push(fund);
  });

  // Extract prices from each row of the table
  const sharePrices = [];
  $("tbody tr").each((_, row) => {
    const date = dayjs($(row).children().first().text().trim());
    const dailyPrices = {
      date: date.format('YYYY-MM-DD'),
      prices: []
    };
    $(row).children().slice(1).each((index, fundPrice) => {
      const fund = fundNames[index];
      const price = $(fundPrice).text().replace('$', '');
      dailyPrices.prices.push({ fund, price })
    });
    sharePrices.push(dailyPrices);
  });

  return sharePrices;
}

async function scrape(url = SHARE_PRICE_URL, browserOptions = { userAgent: USER_AGENT }) {
  const browser = await chromium.launch();
  const context = await browser.newContext(browserOptions);
  const page = await context.newPage();
  await page.goto(url);
  const table = await page.locator('#dynamic-share-price-table').innerHTML();
  await browser.close();
  return parse(table);
}

module.exports.parse = parse;
module.exports.scrape = scrape;

if (require.main === module) {
  scrape()
    .then(sharePrices => {
      console.log(JSON.stringify(sharePrices));
    })
}
