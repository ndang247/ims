const https = require("https");

/**
 * Get UPC data from UPCItemDB API
 * 
 * @param {string} upcCode - UPC code to search for
 * 
 * @returns {Promise<object>} - Promise object representing the UPC data
 * 
 * {
 * 
 *  "code": "OK",
 *
 *  "total": 1,

 *  "offset": 0,

 *  "items": [
 *    {
 *      "ean": "",
 *      "title": "",
 *      "description": "",
 *      "upc": "",
 *      "asin": "",
 *      "brand": "",
 *      "model": "",
 *      "color": "",
 *      "size": "",
 *      "dimension": "",
 *      "weight": "",
 *      "category": "Health & Beauty > Personal Care > Oral Care > Gum Stimulators",
 *      "lowest_recorded_price": 0.0,
 *      "highest_recorded_price": 0.0,
 *      "images": [],
 *      "offers": [],
 *      "elid": ""
 *    }
 *  ]
 *
 * }
*/
async function fetchUPCData(upcCode) {
  const options = {
    hostname: "api.upcitemdb.com",
    path: `/prod/trial/lookup?upc=${upcCode}`,
    method: "GET",
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      // Receive data chunks
      res.on("data", (chunk) => {
        data += chunk;
      });

      // Once the response is complete
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Failed to parse UPC ${upcCode}.`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

module.exports = { fetchUPCData };
