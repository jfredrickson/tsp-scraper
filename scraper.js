const { chromium } = require('playwright');
const cheerio = require('cheerio');
const dayjs = require('dayjs');
const winston = require('winston');
require('dotenv').config();

const SHARE_PRICE_URL = process.env.SHARE_PRICE_URL || 'https://www.tsp.gov/fund-performance/share-price-history/';
const USER_AGENT = process.env.USER_AGENT || 'Mozilla/5.0 (X11; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console()
  ]
});

const run = async () => {
  logger.debug({ userAgent: USER_AGENT });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: USER_AGENT
  });

  logger.debug('Navigating to source page', { url: SHARE_PRICE_URL });
  const page = await context.newPage();
  await page.goto(SHARE_PRICE_URL);
  const table = await page.locator('#dynamic-share-price-table').innerHTML();
  logger.debug('Scraped share price table', { table });

  await browser.close();

  const $ = cheerio.load(table, {}, false);

  // Extract fund names from table heading
  const fundNames = [];
  $("thead th").slice(1).each((_, heading) => {
    const fund = $(heading).text().replace('Fund', '').trim();
    fundNames.push(fund);
  });
  logger.debug('Extracted fund names', { fundNames });

  // Extract prices from each row of the table
  const sharePrices = [];
  $("tbody tr").each((_, row) => {
    const date = dayjs($(row).children().first().text().trim());
    const dailyPrices = {
      date: date.format('YYYY-MM-DD'),
      prices: {}
    };
    $(row).children().slice(1).each((index, fundPrice) => {
      const fund = fundNames[index];
      const price = $(fundPrice).text().replace('$', '');
      dailyPrices.prices[fund] = price;
    });
    sharePrices.push(dailyPrices);
  });
  logger.debug('Extracted share prices', { sharePrices });

  console.log(JSON.stringify(sharePrices));
};

run();
