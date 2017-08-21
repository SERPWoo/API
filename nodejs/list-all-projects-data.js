//
// This code requests all of your projects' data in JSON format
//
// Last updated - Aug 21th, 2017 @ 14:05 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
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
