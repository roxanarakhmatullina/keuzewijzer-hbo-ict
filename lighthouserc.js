module.exports = {
   "ci": {
    "collect": {
      "url": [
        "https://keuzewijzerhboict.nl"
      ],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    },
  },
};