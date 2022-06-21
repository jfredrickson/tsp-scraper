# tsp-scraper

Scrapes the redesigned TSP [share price history page](https://www.tsp.gov/fund-performance/share-price-history/).

## Usage

### Command line

```bash
npm install -g tsp-scraper
npx tsp-scraper
```

### Module

```js
const scraper = require('tsp-scraper');
const prices = await scraper.scrape(); // Returns current TSP share prices
```

## Notes

* The website's HTML can't be scraped via a simple HTML request since the share price table appears to be dynamically generated
* A real user agent needs to be configured because the website doesn't seem to work with the default Playwright user agent
