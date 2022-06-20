# tsp-scraper

Scrapes the redesigned TSP [share price history page](https://www.tsp.gov/fund-performance/share-price-history/).

## Usage

Install:

```bash
npm install tsp-scraper
```

Run:

```bash
npx tsp-scraper
```

## Notes

* The website's HTML can't be scraped via a simple HTML request since the share price table appears to be dynamically generated
* A real user agent needs to be configured because the website doesn't seem to work with the default Playwright user agent
