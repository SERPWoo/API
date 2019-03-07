//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests all of your projects' data in JSON format
//
// Last updated - Mar 7th, 2019 @ 10:45 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
//
// The following modules required to be installed to run this successfully (choose between locally or globally):
// (install locally)
// : npm install request
// : npm install sprintf-js
//
// (install globally)
// : npm install request -g
// : npm install sprintf-js -g
//
// Run Command: nodejs list-all-projects-data.js
//

	var request = require("request")

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
	var API_key = "API_KEY_HERE"

	var url = "https://api.serpwoo.com/v1/projects/?key=" + API_key

		request({
				    url: url,
				    json: true
		}, function (error, response, body) {
				    if (!error && response.statusCode === 200) {
				        console.log(body) // Print the json response
				    }
		})
