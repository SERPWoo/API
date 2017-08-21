//
// GitHub: https://github.com/SERPWoo/API
//
// This code requests all of your projects and outputs their ID, names, amount of keywords, and links to API query of keywords
//
// This output is text format
//
// Last updated - Aug 21th, 2017 @ 16:02 EST (@MercenaryCarter https://github.com/MercenaryCarter and https://twitter.com/MercenaryCarter)
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
									console.log(sprintf("%-15s", 'Project ID'), sprintf("%-70s", 'Project Name'), sprintf("%-20s", 'Total Keywords'), sprintf("%-70s", 'Link to Keywords'));
									console.log(sprintf("%-15s", '----------'), sprintf("%-70s", '------------'), sprintf("%-20s", '--------------'), sprintf("%-70s", '----------------'));
							
									for(var exKey in JsonData.projects) {

										console.log(sprintf("%-15s", exKey), sprintf("%-70s", JsonData.projects[exKey].name), sprintf("%-20s", JsonData.projects[exKey].total.keywords), sprintf("%-70s", JsonData.projects[exKey]._links.keywords));

									}

									console.log("\n--\n");
							
								}else {
									console.log("Something went wrong: ", JsonData.error);							
								}
						
						
				    }
		})
