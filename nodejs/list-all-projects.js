//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests all of your projects and outputs their ID, names, amount of keywords, and links to API query of keywords
//
// This output is text format
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
// Run Command: nodejs list-all-projects.js
//

	var request = require("request");
	var sprintf=require("sprintf-js").sprintf;

	// Get your API Key here: https://www.serpwoo.com/v3/api/ (should be logged in)
	var API_key = "API_KEY_HERE"

	var url = "https://api.serpwoo.com/v1/projects/?key=" + API_key

		request({
				    url: url,
				    json: true
		}, function (error, response, JsonData) {
				    if (!error && response.statusCode === 200) {
						
				        //console.log(JsonData) // Print the json response
						//console.log("Successful: ", JsonData.success);
						
								if (JsonData.success === 1) {

									console.log("\n--\n");
									console.log(sprintf("%-15s %-70s %-20s %-70s", 'Project ID', 'Project Name', 'Total Keywords', 'Link to Keywords'));
									console.log(sprintf("%-15s %-70s %-20s %-70s", '----------', '------------', '--------------', '----------------'));
							
									for(var exKey in JsonData.projects) {

										console.log(sprintf("%-15s %-70s %-20s %-70s", exKey, JsonData.projects[exKey].name, JsonData.projects[exKey].total.keywords, JsonData.projects[exKey]._links.keywords));

									}

									console.log("\n--\n");
							
								}else {
									console.log("Something went wrong: ", JsonData.error);							
								}
						
						
				    }
		})
